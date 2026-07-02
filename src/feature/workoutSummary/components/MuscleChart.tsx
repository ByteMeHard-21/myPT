import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    MuscleDistribution,
} from "../workoutSummary.types";

interface Props {
    data: MuscleDistribution[];
}

export default function MuscleChart({
    data,
}: Props) {

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>
                Muscles Worked
            </Text>

            {data.map((item) => (

                <View
                    key={item.muscle}
                    style={styles.row}
                >
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>
                            {item.muscle}
                        </Text>

                        <Text style={styles.percent}>
                            {item.percentage}%
                        </Text>
                    </View>

                    <View style={styles.track}>
                        <View
                            style={[
                                styles.fill,
                                {
                                    width: `${item.percentage}%`,
                                },
                            ]}
                        />
                    </View>

                </View>

            ))}

        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#102320",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },

    heading: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 18,
    },

    row: {
        marginBottom: 16,
    },

    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    label: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "600",
    },

    percent: {
        color: "#A3E635",
        fontWeight: "700",
    },

    track: {
        height: 10,
        borderRadius: 6,
        backgroundColor: "#17332F",
        overflow: "hidden",
    },

    fill: {
        height: "100%",
        backgroundColor: "#A3E635",
        borderRadius: 6,
    },

});