import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import Svg, {
    Path,
    Circle,
    Line,
    Defs,
    LinearGradient,
    Stop,
} from "react-native-svg";

import SectionCard from "./SectionCard";

import {
    Colors,
    Radius,
    Spacing,
} from "../../workout/theme";
import { VolumePoint } from "../analysis.types";

const values = [
    16000,
    20500,
    19500,
    24500,
    31500,
    30000,
    18000,
];

const labels = [
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
    "S",
];

const GRAPH_WIDTH = 420;
const GRAPH_HEIGHT = 180;

interface Props {
    period: "week" | "month";
    setPeriod: React.Dispatch<
        React.SetStateAction<"week" | "month">
    >;
    volumeTrend: VolumePoint[];
}
export default function WeeklyGoalCard({
    period,
    setPeriod,
    volumeTrend,
}: Props) {

    const values = volumeTrend.map(
        (item) => item.volume
    );

    const labels = volumeTrend.map(
        (item) => item.label
    );

    const max =
        values.length > 0
            ? Math.max(...values)
            : 1;

    const min = 0;

    const stepX =
        values.length > 1
            ? GRAPH_WIDTH / (values.length - 1)
            : GRAPH_WIDTH;

    const points = values.map(
        (value, index) => ({
            x: index * stepX,

            y:
                GRAPH_HEIGHT -
                ((value - min) /
                    (max - min)) *
                GRAPH_HEIGHT,
        })
    );

    const linePath = points
        .map((point, index) =>
            index === 0
                ? `M ${point.x} ${point.y}`
                : `L ${point.x} ${point.y}`
        )
        .join(" ");

    const areaPath = `
${linePath}
L ${GRAPH_WIDTH} ${GRAPH_HEIGHT}
L 0 ${GRAPH_HEIGHT}
Z
`;

    return (
        <SectionCard>

            {/* Header */}

            <View style={styles.header}>

                <View style={styles.headerLeft}>

                    <Text style={styles.title}>
                        Weekly Volume
                    </Text>

                    <Text style={styles.subtitle}>
                        Total weight lifted last 7 days
                    </Text>

                </View>

                <View style={styles.segment}>

                    {(["week", "month"] as const).map(
                        (item) => (

                            <TouchableOpacity
                                key={item}
                                onPress={() =>
                                    setPeriod(item)
                                }
                                style={[
                                    styles.segmentItem,
                                    period === item &&
                                    styles.activeSegment,
                                ]}
                            >

                                <Text
                                    style={[
                                        styles.segmentText,
                                        period === item &&
                                        styles.activeSegmentText,
                                    ]}
                                >
                                    {item === "week"
                                        ? "Week"
                                        : "Month"}
                                </Text>

                            </TouchableOpacity>

                        )
                    )}

                </View>

            </View>

            {/* Graph */}

            <View style={styles.graphWrapper}>
                {/* Y Labels */}
                <View style={styles.yLabels}>
                    {["32k", "28k", "24k", "20k", "16k"].map(label => (
                        <Text
                            key={label}
                            style={styles.yLabel}
                        >
                            {label}
                        </Text>
                    ))}
                </View>

                {/* SVG */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.graphScrollContent}
                >

                    <View>

                        <Svg
                            width={GRAPH_WIDTH}
                            height={GRAPH_HEIGHT + 10}
                        >

                            <Defs>

                                <LinearGradient
                                    id="gradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <Stop
                                        offset="0%"
                                        stopColor={Colors.primary}
                                        stopOpacity={0.35}
                                    />

                                    <Stop
                                        offset="100%"
                                        stopColor={Colors.primary}
                                        stopOpacity={0}
                                    />
                                </LinearGradient>

                            </Defs>

                            {/* Horizontal Grid */}

                            {[0, 1, 2, 3, 4].map(i => (

                                <Line
                                    key={i}
                                    x1="0"
                                    y1={i * 45}
                                    x2={GRAPH_WIDTH}
                                    y2={i * 45}
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="1"
                                />

                            ))}

                            {/* Vertical Axis */}

                            <Line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2={GRAPH_HEIGHT}
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="1"
                            />

                            {/* Bottom Axis */}

                            <Line
                                x1="0"
                                y1={GRAPH_HEIGHT}
                                x2={GRAPH_WIDTH}
                                y2={GRAPH_HEIGHT}
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="1"
                            />

                            {/* Area */}

                            <Path
                                d={areaPath}
                                fill="url(#gradient)"
                            />

                            {/* Line */}

                            <Path
                                d={linePath}
                                stroke={Colors.primary}
                                strokeWidth={3}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Points */}

                            {points.map((point, index) => (

                                <Circle
                                    key={index}
                                    cx={point.x}
                                    cy={point.y}
                                    r={5}
                                    fill={Colors.primary}
                                />

                            ))}

                        </Svg>

                        {/* X Axis */}

                        <View
                            style={[
                                styles.daysContainer,
                                { width: GRAPH_WIDTH },
                            ]}
                        >
                            {labels.map((label, index) => (

                                <Text
                                    key={index}
                                    style={styles.day}
                                >
                                    {label}
                                </Text>

                            ))}
                        </View>

                    </View>

                </ScrollView>

            </View>

        </SectionCard>
    );
}

const styles = StyleSheet.create({

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    headerLeft: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.text,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 13,
        color: Colors.subText,
    },

    // ======================
    // Segmented Control
    // ======================
    segmentItem: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.pill,
        alignItems: "center",
        justifyContent: "center",
    },

    activeSegment: {
        backgroundColor: Colors.primary,
    },

    segmentText: {
        color: Colors.subText,
        fontSize: 12,
        fontWeight: "600",
    },

    activeSegmentText: {
        color: Colors.background,
        fontWeight: "700",
    },


    graphScrollContent: {
        paddingRight: 24,
    },

    segment: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#101A18",
        borderRadius: Radius.pill,
        paddingVertical: 4,
    },

    activeChip: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 4,
    },

    activeChipText: {
        color: Colors.background,
        fontWeight: "700",
        fontSize: 10,
    },

    chipText: {
        color: Colors.subText,

        fontSize: 11,

        fontWeight: "600",

        marginHorizontal: 6,
    },

    // ======================
    // Graph
    // ======================

    graphWrapper: {
        flexDirection: "row",

        marginTop: 28,
    },

    yLabels: {
        width: 42,

        height: 180,

        justifyContent: "space-between",

        alignItems: "flex-end",

        paddingRight: 10,
    },

    yLabel: {
        color: "#6B7280",

        fontSize: 11,

        fontWeight: "600",
    },

    graphContainer: {
        flex: 1,

        height: 180,

        justifyContent: "center",
    },

    // ======================
    // X Axis Labels
    // ======================

    daysRow: {
        flexDirection: "row",

        marginTop: 14,
    },

    daysContainer: {
        width: 290,

        flexDirection: "row",

        justifyContent: "space-between",
    },

    day: {
        width: 18,

        textAlign: "center",

        color: "#6B7280",

        fontSize: 12,

        fontWeight: "700",
    },

});