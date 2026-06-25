/**
 * MetricCard.tsx
 * -----------------------------------------------------------------------
 * Shared shell for the Height and Weight cards: label, live value with
 * unit suffix, a small tappable unit toggle (cm/ft or kg/lb), and the
 * vertical wheel. Height and Weight render two of these side by side,
 * sharing the same visual rhythm so they read as one connected unit.
 */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    SharedValue,
} from "react-native-reanimated";
import VerticalWheelPicker from "./Verticalwheelpicker";

interface MetricCardProps {
    label: string;
    displayValue: string;
    unitSuffix: string;
    values: number[];
    selectedValue: number;
    onChange: (value: number) => void;
    unitOptions: [string, string];
    activeUnit: string;
    onToggleUnit: () => void;
    revealProgress: SharedValue<number>;
    revealStart: number;
    revealEnd: number;
}

export default function MetricCard({
    label,
    displayValue,
    unitSuffix,
    values,
    selectedValue,
    onChange,
    unitOptions,
    activeUnit,
    onToggleUnit,
    revealProgress,
    revealStart,
    revealEnd,
}: MetricCardProps) {
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
            [20, 0],
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
                <Text style={styles.label}>{label}</Text>

                <TouchableOpacity
                    onPress={onToggleUnit}
                    style={styles.unitToggle}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                    <Text style={styles.unitToggleText}>
                        {unitOptions[0]} / {unitOptions[1]}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.valueRow}>
                <Text style={styles.value}>{displayValue}</Text>
                {unitSuffix ? (
                    <Text style={styles.unitSuffix}> {unitSuffix}</Text>
                ) : null}
            </View>

            <VerticalWheelPicker
                values={values}
                selectedValue={selectedValue}
                onChange={onChange}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: "#131A18",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#1F2A27",
        paddingTop: 16,
        paddingHorizontal: 14,
        paddingBottom: 14,

        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },

    label: {
        color: "#9CA3AF",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    unitToggle: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        backgroundColor: "rgba(163,230,53,0.08)",
    },

    unitToggleText: {
        color: "#A3E635",
        fontSize: 10,
        fontWeight: "700",
    },

    valueRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 10,
    },

    value: {
        color: "#A3E635",
        fontSize: 22,
        fontWeight: "800",
    },

    unitSuffix: {
        color: "#A3E635",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 3,
    },
});