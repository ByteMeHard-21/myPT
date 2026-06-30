import React from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
    image: any;
    title: string;
    duration?: string;
    description?: string;
};

export default function SuggestionCard({
    image,
    title,
    duration,
    description,
}: Props) {
    return (
        <ImageBackground
            source={image}
            style={styles.image}
            imageStyle={styles.imageStyle}
        >
            {/* Bottom Gradient */}
            <LinearGradient
                colors={[
                    "transparent",
                    "rgba(0,0,0,0.25)",
                    "rgba(0,0,0,0.75)",
                ]}
                style={styles.overlay}
            >
                <Text style={styles.title}>{title}</Text>

                <Text style={styles.subtitle}>
                    {duration ?? description}
                </Text>
            </LinearGradient>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
        marginRight: 14,
        overflow: "hidden",
        borderRadius: 18,
    },

    imageStyle: {
        borderRadius: 18,
    },

    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 14,
        paddingBottom: 14,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 3,
        color: "rgba(255,255,255,0.9)",
        fontSize: 13,
        fontWeight: "500",
    },
});