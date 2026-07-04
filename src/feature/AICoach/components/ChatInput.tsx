import React from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    Colors,
    Radius,
    Spacing,
} from "../../workout/theme";

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
}

export default function ChatInput({
    value,
    onChangeText,
    onSend,
}: Props) {

    return (

        <View style={styles.container}>

            <Ionicons
                name="mic-outline"
                size={20}
                color={Colors.subText}
            />

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="Type your question..."
                placeholderTextColor={Colors.subText}
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.send}
                activeOpacity={0.85}
                onPress={() => onSend()}
            >
                <Ionicons
                    name="arrow-forward"
                    size={22}
                    color={Colors.background}
                />
            </TouchableOpacity>

        </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: Colors.surfaceElevated,

        borderTopWidth: 1,
        borderColor: Colors.border,

        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    input: {
        flex: 1,
        height: 48,
        backgroundColor: Colors.background,
        borderRadius: 24,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        color: Colors.text,
    },

    send: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },
});