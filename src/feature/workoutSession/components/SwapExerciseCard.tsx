import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors, Radius, Spacing } from "../../workout/theme";

interface Props {
    item: any;
    selected: boolean;
    onPress: () => void;
}

export default function SwapExerciseCard({
    item,
    selected,
    onPress,
}: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[
                styles.card,
                selected && styles.selectedCard,
            ]}
            onPress={onPress}
        >
            {selected && (
                <View style={styles.checkContainer}>
                    <Ionicons
                        name="checkmark"
                        size={16}
                        color={Colors.primary}
                    />
                </View>
            )}

            <Image
                source={
                    item.thumbnail
                        ? { uri: item.thumbnail }
                        : require("../../../../assets/images/placeholder_img.jpg") // optional fallback
                }
                style={styles.image}
            />

            <Text
                numberOfLines={2}
                style={styles.name}
            >
                {item.name}
            </Text>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,

        backgroundColor: Colors.surface,

        borderRadius: Radius.lg,

        borderWidth: 1,

        borderColor: Colors.border,

        alignItems: "center",

        padding: 12,

        marginBottom: Spacing.lg,
    },

    selectedCard: {
        borderColor: Colors.primary,

        borderWidth: 2,
    },

    image: {
        width: "100%",

        height: 130,

        resizeMode: "cover",

        borderRadius: Radius.sm,
    },

    name: {
        marginTop: 12,

        color: Colors.text,

        fontWeight: "600",

        fontSize: 15,

        textAlign: "center",
    },

    checkContainer: {
        position: "absolute",

        right: 10,

        top: 10,

        width: 24,

        height: 24,

        borderRadius: 12,

        backgroundColor: Colors.surface,

        justifyContent: "center",

        alignItems: "center",

        zIndex: 10,
    },
});