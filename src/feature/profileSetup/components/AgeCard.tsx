/**
 * AgeCard.tsx
 * -----------------------------------------------------------------------
 * Hero card for age selection. Label top-left, live value top-right in
 * lime, horizontal wheel beneath. Entrance: fades + rises in as part of
 * the screen's staggered reveal sequence (driven by the parent via the
 * `entranceDelay` prop feeding a shared progress value).
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    SharedValue,
} from "react-native-reanimated";
import HorizontalWheelPicker from "./HorizontalWheel";

interface AgeCardProps {
    age: number;
    values: number[];
    onChange: (value: number) => void;
    revealProgress: SharedValue<number>;
    // 0 = appears with header, 1 = appears after height/weight, etc.
    // Used to offset this card's own fade/rise within the shared timeline.
    revealStart: number;
    revealEnd: number;
}

export default function AgeCard({
    age,
    values,
    onChange,
    revealProgress,
    revealStart,
    revealEnd,
}: AgeCardProps) {
    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            revealProgress.value,
            [revealStart, revealEnd],
            [0, 1],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            revealProgress.value,
            [revealStart, revealEnd],
            [16, 0],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <View style={styles.headerRow}>
                <Text style={styles.label}>AGE</Text>
                <Text style={styles.value}>{age}</Text>
            </View>

            <HorizontalWheelPicker
                values={values}
                selectedValue={age}
                onChange={onChange}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#131A18",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#1F2A27",
        paddingTop: 18,
        paddingBottom: 8,
        paddingHorizontal: 20,
        marginBottom: 16,

        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },

    label: {
        color: "#9CA3AF",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },

    value: {
        color: "#A3E635",
        fontSize: 26,
        fontWeight: "800",
    },
});