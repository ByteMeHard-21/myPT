import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import SectionCard from "./SectionCard";
import { Colors, Spacing } from "../../workout/theme";
import { PersonalRecord } from "../analysis.types";

interface Record {
    exercise: string;
    value: string;
}

interface Props {
    records: PersonalRecord[];
}

export default function PersonalRecordCard({
    records,
}: Props) {
    return (
        <SectionCard>
            <Text style={styles.title}>
                Personal Records
            </Text>

            {records.map((record, index) => (
                <View
                    key={record.exercise}
                    style={[
                        styles.row,
                        index !== records.length - 1 &&
                        styles.divider,
                    ]}
                >
                    <View style={styles.left}>
                        <Ionicons
                            name="trophy"
                            size={20}
                            color={Colors.primary}
                        />

                        <Text style={styles.exercise}>
                            {record.exercise}
                        </Text>
                    </View>

                    <Text style={styles.value}>
                        {record.value}
                    </Text>
                </View>
            ))}
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    title: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: Spacing.lg,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: Spacing.md,
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    exercise: {
        color: Colors.text,
        marginLeft: Spacing.sm,
        fontSize: 15,
        fontWeight: "600",
    },

    value: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: "700",
    },
});