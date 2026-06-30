import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface WorkoutAccordionProps {
    title: string;
    content: string | string[];
}

export default function WorkoutAccordion({
    title,
    content,
}: WorkoutAccordionProps) {
    const [expanded, setExpanded] = useState(false);

    const toggleAccordion = () => {
        LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut
        );

        setExpanded(!expanded);
    };

    const renderContent = () => {
        if (Array.isArray(content)) {
            return content.map((item, index) => (
                <View
                    key={index}
                    style={styles.bulletRow}
                >
                    <View style={styles.bullet} />

                    <Text style={styles.body}>
                        {item}
                    </Text>
                </View>
            ));
        }

        return (
            <Text style={styles.body}>
                {content}
            </Text>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                activeOpacity={0.8}
                onPress={toggleAccordion}
            >
                <Text style={styles.title}>
                    {title}
                </Text>

                <Ionicons
                    name={
                        expanded
                            ? "chevron-up"
                            : "chevron-down"
                    }
                    color="#FFFFFF"
                    size={18}
                />
            </TouchableOpacity>

            {expanded && (
                <View style={styles.content}>
                    {renderContent()}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        backgroundColor: "#173C38",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2A4B45",
        overflow: "hidden",
    },

    header: {
        minHeight: 56,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },

    content: {
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.08)",
        paddingHorizontal: 18,
        paddingVertical: 16,
    },

    body: {
        flex: 1,
        color: "rgba(255,255,255,0.65)",
        fontSize: 14,
        lineHeight: 22,
    },

    bulletRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#A3E635",
        marginTop: 8,
        marginRight: 10,
    },
});