import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, Radius } from "../../workout/theme";

interface LogoutModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({
    visible,
    onCancel,
    onConfirm,
}: LogoutModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="log-out-outline"
                            size={34}
                            color={Colors.danger}
                        />
                    </View>

                    <Text style={styles.title}>
                        Logout?
                    </Text>

                    <Text style={styles.description}>
                        You're about to sign out of your account.
                        You can sign back in anytime using your
                        email and password.
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.logoutButton}
                            onPress={onConfirm}
                        >
                            <Text style={styles.logoutText}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 28,
    },

    card: {
        width: "100%",
        backgroundColor: "#173C36",
        borderRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 24,
        borderWidth: 1,
        borderColor: "#2F5A53",
    },

    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "rgba(239,68,68,0.12)",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: Colors.text,
        textAlign: "center",
    },

    description: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 24,
        color: Colors.subText,
        textAlign: "center",
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 28,
    },

    cancelButton: {
        flex: 1,
        height: 52,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: "#2F5A53",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },

    logoutButton: {
        flex: 1,
        height: 52,
        borderRadius: Radius.lg,
        backgroundColor: Colors.danger,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },

    cancelText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: "600",
    },

    logoutText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});