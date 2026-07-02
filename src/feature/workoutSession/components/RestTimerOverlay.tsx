import React, { useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    visible: boolean;

    remainingSeconds: number;

    initialSeconds: number;

    onAdd30: () => void;

    onSkip: () => void;
}

const SIZE = 220;
const STROKE = 12;

const RADIUS = (SIZE - STROKE) / 2;

const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RestTimerOverlay({
    visible,
    remainingSeconds,
    initialSeconds,
    onAdd30,
    onSkip,
}: Props) {
    if (!visible) return null;

    const progress = useMemo(() => {
        if (initialSeconds <= 0) return 0;

        return remainingSeconds / initialSeconds;
    }, [remainingSeconds, initialSeconds]);

    const dashOffset =
        CIRCUMFERENCE * (1 - progress);

    const minutes = Math.floor(
        remainingSeconds / 60
    );

    const seconds = remainingSeconds % 60;

    const formatted =
        `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>

                <Text style={styles.title}>
                    Rest Time
                </Text>

                <View style={styles.circleWrapper}>

                    <Svg
                        width={SIZE}
                        height={SIZE}
                    >
                        <Circle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={RADIUS}
                            stroke="#284742"
                            strokeWidth={STROKE}
                            fill="none"
                        />

                        <Circle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={RADIUS}
                            stroke="#A3E635"
                            strokeWidth={STROKE}
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={dashOffset}
                            rotation="-90"
                            origin={`${SIZE / 2}, ${SIZE / 2}`}
                        />
                    </Svg>

                    <View style={styles.centerContent}>
                        <Text style={styles.time}>
                            {formatted}
                        </Text>

                        <Text style={styles.label}>
                            Remaining
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonsRow}>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={onAdd30}
                    >
                        <Ionicons
                            name="add"
                            color="#A3E635"
                            size={20}
                        />

                        <Text style={styles.secondaryText}>
                            30 sec
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={onSkip}
                    >
                        <Text style={styles.primaryText}>
                            Skip Rest
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: "rgba(5,16,14,0.82)",

        justifyContent: "center",
        alignItems: "center",

        zIndex: 999,
    },

    card: {
        width: "88%",
        backgroundColor: "#163B37",
        borderRadius: 28,
        paddingVertical: 32,
        paddingHorizontal: 22,
        alignItems: "center",
    },

    title: {
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 28,
    },

    circleWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },

    centerContent: {
        position: "absolute",
        alignItems: "center",
    },

    time: {
        color: "#FFFFFF",
        fontSize: 42,
        fontWeight: "800",
    },
    label: {
        color: "#B8C9C5",
        marginTop: 6,
        fontSize: 15,
    },

    buttonsRow: {
        marginTop: 36,
        flexDirection: "row",
    },

    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#20433F",
        borderRadius: 18,
        paddingHorizontal: 22,
        height: 54,
        marginRight: 12,
    },
    secondaryText: {
        color: "#A3E635",
        fontWeight: "700",
        marginLeft: 6,
        fontSize: 16,
    },

    primaryButton: {
        flex: 1,
        height: 54,
        backgroundColor: "#A3E635",
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },

    primaryText: {
        color: "#082320",
        fontWeight: "800",
        fontSize: 17,
    },
});