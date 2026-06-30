import React, { useMemo, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
} from "react-native";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import ProfileCard from "./components/ProfileCard";
import ProfileHeader from "./components/ProfileHeader";
import FitnessSnapshot from "./components/FitnessSnapshot";
import JourneySection from "./components/JourneySection";
import AccountSection from "./components/AccountSection";
import { Colors, Radius } from "../workout/theme";
import { useAuthStore } from "../../store/authStore";
import {
    uploadAvatar,
    deleteProfileImage,
} from '../../services/avatar.service';
import { supabase } from "../../services/supabase";
import { UserProfile } from "../auth/auth.types";

import { updateAvatar } from './profile.api';

interface SheetOptionProps {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    title: string;
    danger?: boolean;
    onPress: () => void;
}

const SheetOption: React.FC<SheetOptionProps> = ({
    icon,
    title,
    danger = false,
    onPress,
}) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.option,
            pressed && styles.optionPressed,
        ]}
    >
        {({ pressed }) => (
            <>
                <Ionicons
                    name={icon}
                    size={22}
                    color={danger ? "#FF6B6B" : "#A3E635"}
                />

                <Text
                    style={[
                        styles.optionText,
                        danger && styles.optionDanger,
                    ]}
                >
                    {title}
                </Text>

                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={
                        pressed
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.35)"
                    }
                />
            </>
        )}
    </Pressable>
);


export default function ProfileScreen() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const profile = useAuthStore((state) => state.profile);
    const setProfile = useAuthStore((state) => state.setProfile);

    const snapPoints = useMemo(() => ["36%"], []);

    const openProfileSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const closeSheet = () => {
        bottomSheetRef.current?.close();
    };

    const handleTakePhoto = async () => {
        try {
            const permission =
                await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                alert("Camera permission is required.");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (result.canceled) return;

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const avatarUrl = await uploadAvatar(
                user.id,
                result.assets[0].uri
            );

            await updateAvatar(user.id, avatarUrl);

            setProfile({
                ...profile!,
                avatar_url: avatarUrl,
            });

            closeSheet();
        } catch (error) {
            console.error("Failed to upload avatar:", error);
        }
    };

    const handleChoosePhoto = async () => {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                alert("Gallery permission is required.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (result.canceled) return;

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const avatarUrl = await uploadAvatar(
                user.id,
                result.assets[0].uri
            );

            await updateAvatar(user.id, avatarUrl);

            setProfile({
                ...profile!,
                avatar_url: avatarUrl,
            });

            closeSheet();
        } catch (error) {
            console.log(error);
        }
    };

    const handleChooseAvatar = () => {
        closeSheet();
        console.log("Choose Avatar");
    };

    const handleRemovePhoto = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            await deleteProfileImage(user.id);

            await updateAvatar(user.id, null);

            setProfile({
                ...profile!,
                avatar_url: null,
            });

            closeSheet();
        } catch (error) {
            console.log(error);
        }
    };

    const formatText = (value?: string | null) =>
        value
            ? value.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
            : "-";

    const snapshot = {
        goal: formatText(profile?.goal),
        experience: formatText(profile?.experience_level),
        height: profile?.height_cm
            ? `${profile.height_cm} cm`
            : "-",
        weight: profile?.weight_kg
            ? `${profile.weight_kg} kg`
            : "-",
    };

    if (!profile) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <ProfileHeader
                    onSettingsPress={() =>
                        console.log("Settings")
                    }
                />
                <ProfileCard
                    image={profile?.avatar_url}
                    name={profile?.full_name}
                    goal={profile?.goal}
                    experience={profile?.experience_level}
                    onCameraPress={openProfileSheet}
                />

                {/* Other profile sections */}
                <FitnessSnapshot
                    snapshot={snapshot}
                    onEditPress={() => console.log("Edit Fitness")}
                />

                <JourneySection />

                <AccountSection />

                <Pressable
                    onPress={() => console.log("Logout")}
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.logoutButtonPressed,
                    ]}
                >
                    {({ pressed }) => (
                        <>
                            <Ionicons
                                name="log-out-outline"
                                size={22}
                                color={pressed ? Colors.text : Colors.danger}
                            />

                            <Text
                                style={[
                                    styles.logoutText,
                                    pressed && styles.logoutTextPressed,
                                ]}
                            >
                                Logout
                            </Text>
                        </>
                    )}
                </Pressable>
            </ScrollView>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={{
                    backgroundColor: "#1A403A",
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                }}
                handleIndicatorStyle={{
                    width: 48,
                    height: 5,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.18)",
                }}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        opacity={0.5}
                        pressBehavior="close"
                    />
                )}
            >
                <BottomSheetView style={styles.sheetContent}>
                    <Text style={styles.sheetTitle}>
                        Profile Photo
                    </Text>

                    <SheetOption
                        icon="camera-outline"
                        title="Take Photo"
                        onPress={handleTakePhoto}
                    />

                    <SheetOption
                        icon="images-outline"
                        title="Gallery"
                        onPress={handleChoosePhoto}
                    />

                    <SheetOption
                        icon="person-circle-outline"
                        title="Choose Avatar"
                        onPress={handleChooseAvatar}
                    />

                    <SheetOption
                        icon="trash-outline"
                        title="Remove Photo"
                        danger
                        onPress={handleRemovePhoto}
                    />

                    <Pressable
                        onPress={closeSheet}
                        style={({ pressed }) => [
                            styles.cancelButton,
                            pressed && styles.cancelButtonPressed,
                        ]}
                    >
                        <Text style={styles.cancelText}>
                            Cancel
                        </Text>
                    </Pressable>
                </BottomSheetView>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },

    heading: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.text,
    },

    sheetContent: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 12,
    },

    sheetTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 18,
    },

    option: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",

        borderBottomWidth: 1,
        borderBottomColor: "#2F5A53",
    },

    optionPressed: {
        backgroundColor: "#215047",
    },

    optionText: {
        flex: 1,

        marginLeft: 16,

        color: "#FFFFFF",

        fontSize: 16,

        fontWeight: "500",
    },

    optionDanger: {
        color: "#FF6B6B",
    },

    cancelButton: {
        marginTop: 18,
        height: 54,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#143532", // darker than sheet

        borderWidth: 1,
        borderColor: "#2F5A53",

        borderRadius: 16,
    },

    cancelButtonPressed: {
        backgroundColor: "#215047",
    },

    cancelText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.2,
    },

    logoutButton: {
        marginTop: 28,
        marginBottom: 40,
        height: 56,
        borderRadius: Radius.xl,

        borderWidth: 1,
        borderColor: Colors.danger,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "transparent",
    },

    logoutButtonPressed: {
        backgroundColor: Colors.danger,
    },

    logoutText: {
        marginLeft: 10,
        color: Colors.danger,
        fontSize: 16,
        fontWeight: "700",
    },

    logoutTextPressed: {
        color: Colors.text, // black
    },
});