import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";

import SectionCard from "./SectionCard";
import MonthCalendar from "./MonthCalendar";

import {
    Colors,
    Spacing,
} from "../../workout/theme";
import { CalendarDay } from "../analysis.types";

interface Props {
    calendar: CalendarDay[];
}

export default function WorkoutConsistencyCalendar({
    calendar,
}: Props) {
    const weekDays = [
        "M",
        "T",
        "W",
        "T",
        "F",
        "S",
        "S",
    ];
    // const months = [
    //     {
    //         month: "May",
    //         active: [
    //             2, 3, 4, 5,
    //             7, 8, 9,
    //             13, 14, 16,
    //             20, 21, 22,
    //             24, 27, 30,
    //         ],
    //     },

    //     {
    //         month: "June",
    //         active: [
    //             1, 4, 6,
    //             9, 10, 11,
    //             15, 16, 18,
    //             21, 22, 23,
    //             28,
    //         ],
    //     },

    //     {
    //         month: "July",
    //         active: [
    //             1, 2, 5,
    //             8, 9, 10,
    //             11, 12, 15,
    //             18, 19, 20,
    //             22, 23, 24,
    //             28, 29,
    //         ],
    //     },

    //     {
    //         month: "August",
    //         active: [
    //             3, 6, 7,
    //             11, 13, 15,
    //             18, 19, 20,
    //             26,
    //         ],
    //     },
    // ];
    const months = Object.values(
        calendar.reduce((acc, day) => {
            const date = new Date(day.date);

            const month = date.toLocaleString("default", {
                month: "long",
            });

            const dayNumber = date.getDate();

            if (!acc[month]) {
                acc[month] = {
                    month,
                    active: [],
                };
            }

            if (day.completed) {
                acc[month].active.push(dayNumber);
            }

            return acc;
        }, {} as Record<string, {
            month: string;
            active: number[];
        }>)
    );

    return (

        <SectionCard>

            <Text style={styles.title}>
                Workout Consistency
            </Text>

            <Text style={styles.subtitle}>
                Build streaks by showing up consistently.
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {months.map(month => (
                    <MonthCalendar
                        key={month.month}
                        month={month.month}
                        active={month.active}
                    />
                ))}
            </ScrollView>

            <View style={styles.legend}>

                <Text style={styles.legendText}>
                    Less
                </Text>

                <View style={styles.legendBox} />

                <View
                    style={[
                        styles.legendBox,
                        {
                            backgroundColor:
                                Colors.primary,
                        },
                    ]}
                />

                <Text style={styles.legendText}>
                    More
                </Text>

            </View>

        </SectionCard>

    );
}

const styles = StyleSheet.create({

    title: {
        color: Colors.text,
        fontSize: 22,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 4,
        color: Colors.subText,
        fontSize: 13,
    },

    content: {
        paddingTop: 26,
        paddingBottom: 8,
    },

    legend: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: Spacing.lg,
    },

    legendBox: {
        width: 14,
        height: 14,
        borderRadius: 4,
        backgroundColor: "#2A3230",
        marginHorizontal: 5,
    },

    legendText: {
        color: Colors.subText,
        fontSize: 12,
    },

});