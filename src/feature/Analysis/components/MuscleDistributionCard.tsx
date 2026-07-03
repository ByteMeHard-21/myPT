import React from "react";
import {
    Text,
    StyleSheet,
} from "react-native";

import SectionCard from "./SectionCard";
import MuscleRow from "./MuscleRow";

import {
    Colors,
    Spacing,
} from "../../workout/theme";
import { MuscleDistribution } from "../analysis.types";

const DATA = [
    {
        muscle: "Chest",
        percentage: 42,
    },
    {
        muscle: "Back",
        percentage: 28,
    },
    {
        muscle: "Legs",
        percentage: 18,
    },
    {
        muscle: "Shoulders",
        percentage: 12,
    },
];
interface Props {
    data: MuscleDistribution[];
}

export default function MuscleDistributionCard({
    data,
}: Props) {
    return (
        <SectionCard>
            <Text style={styles.title}>
                Muscle Distribution
            </Text>

            {data.map((item) => (
                <MuscleRow
                    key={item.muscle}
                    muscle={item.muscle}
                    percentage={item.percentage}
                />
            ))}
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    title: {
        color: Colors.text,

        fontSize: 18,

        fontWeight: "700",

        marginBottom: Spacing.xl,
    },
});