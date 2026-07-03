import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import {
    Colors,
    Radius,
} from "../../workout/theme";

interface Props {
    month: string;
    active: number[];
}

const weekDays = [
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
    "S",
];

const TOTAL_DAYS = 35;

export default function MonthCalendar({
    month,
    active,
}: Props) {

    return (
        <View style={styles.container}>

            {/* Week Days */}

            <View style={styles.weekRow}>
                {weekDays.map((day, index) => (
                    <Text
                        key={`${day}-${index}`}
                        style={styles.weekDay}
                    >
                        {day}
                    </Text>
                ))}
            </View>

            {/* Heatmap */}

            <View style={styles.grid}>

                {Array.from({
                    length: TOTAL_DAYS,
                }).map((_, index) => {

                    const day = index + 1;

                    const filled =
                        active.includes(day);

                    return (
                        <View
                            key={day}
                            style={[
                                styles.cell,
                                filled &&
                                styles.activeCell,
                            ]}
                        />
                    );
                })}

            </View>

            {/* Month */}

            <Text style={styles.month}>
                {month}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        marginRight: 28,
    },

    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    weekDay: {
        width: 18,
        textAlign: "center",
        color: Colors.subText,
        fontWeight: "600",
        fontSize: 11,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: 7 * 21, // 7 columns fixed
    },

    cell: {
        width: 15,
        height: 15,
        borderRadius: 5,
        backgroundColor: "#2A3230",

        marginRight: 6,
        marginBottom: 6,
    },

    activeCell: {
        backgroundColor: Colors.primary,
    },

    month: {
        marginTop: 14,
        textAlign: "center",
        color: Colors.text,
        fontSize: 15,
        fontWeight: "700",
    },

});