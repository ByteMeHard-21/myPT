import React, { useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";

import { Colors } from "../theme";
import { Spacing } from "../theme";
import { Radius } from "../theme";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
    const week = useMemo(() => {
        const today = new Date();

        const currentDay = today.getDay();

        const start = new Date(today);
        start.setDate(today.getDate() - currentDay);

        return Array.from({ length: 7 }).map((_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);

            return {
                day: WEEK_DAYS[date.getDay()],
                date: date.getDate(),
                active:
                    date.toDateString() === today.toDateString(),
            };
        });
    }, []);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {week.map((item, index) => (
                <View
                    key={index}
                    style={[
                        styles.dayCard,
                        item.active && styles.activeDayCard,
                    ]}
                >
                    <Text
                        style={[
                            styles.dayText,
                            item.active && styles.activeDayText,
                        ]}
                    >
                        {item.day}
                    </Text>

                    <View
                        style={[
                            styles.dateCircle,
                            item.active && styles.activeDateCircle,
                        ]}
                    >
                        <Text
                            style={[
                                styles.dateText,
                                item.active && styles.activeDateText,
                            ]}
                        >
                            {item.date}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default React.memo(Calendar);

const styles = StyleSheet.create({
    container: {
        paddingRight: 12,
    },

    dayCard: {
        width: 58,
        height: 96,
        backgroundColor: Colors.surface,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "space-evenly",
        marginRight: 10, // spacing between cards

        borderWidth: 1,
        borderColor: Colors.border,
    },

    activeDayCard: {
        // Previously: "#D8FF3E"
        backgroundColor: Colors.primary,
    },

    dayText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.text,
    },

    activeDayText: {
        color: Colors.background,
    },

    dateCircle: {
        width: 42,
        height: 42,
        borderRadius: "50%",
        backgroundColor: Colors.surfaceElevated,
        alignItems: "center",
        justifyContent: "center",
    },

    activeDateCircle: {
        backgroundColor: Colors.text,
    },

    dateText: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.text,
    },

    activeDateText: {
        color: Colors.background,
    },
});