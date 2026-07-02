import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { WorkoutSet } from "../workoutSession.types";

interface Props {
    sets: WorkoutSet[];
    activeUndoSet: number | null;

    onToggleSet: (setNumber: number) => void;
    onWeightChange: (setNumber: number, value: string) => void;
    onRepsChange: (setNumber: number, value: string) => void;
}

export default function SetTracker({
    sets,
    activeUndoSet,
    onToggleSet,
    onWeightChange,
    onRepsChange,
}: Props) {

    const isRowComplete = (item: WorkoutSet) => {
        return (
            item.enteredWeight !== "" &&
            item.enteredReps !== "" &&
            Number(item.enteredWeight) > 0 &&
            Number(item.enteredReps) > 0
        );
    };



    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.checkboxHeader} />

                <View style={styles.setColumn}>
                    <Text style={styles.headerText}>SET</Text>
                </View>

                <View style={styles.weightColumn}>
                    <Text style={styles.headerText}>WEIGHT</Text>
                </View>

                <View style={styles.repsColumn}>
                    <Text style={styles.headerText}>REPS</Text>
                </View>
            </View>

            {sets.map((item, index) => (
                <React.Fragment key={item.setNumber}>

                    <View
                        style={[
                            styles.row,
                            activeUndoSet === item.setNumber &&
                            styles.completedRow,
                        ]}
                    >

                        {/* Checkbox */}
                        <TouchableOpacity
                            disabled={
                                !isRowComplete(item) ||
                                item.completed
                            }
                            onPress={() => onToggleSet(item.setNumber)}
                            style={[
                                styles.checkbox,
                                item.completed &&
                                styles.checkboxCompleted,
                                !isRowComplete(item) &&
                                styles.checkboxDisabled,
                            ]}
                        >
                            {item.completed && (
                                <Ionicons
                                    name="checkmark"
                                    size={16}
                                    color="#082320"
                                />
                            )}
                        </TouchableOpacity>

                        {/* Set */}
                        <View style={styles.setColumn}>
                            <Text style={styles.setNumber}>
                                {item.setNumber}
                            </Text>
                        </View>

                        {/* Weight */}
                        <View style={styles.weightColumn}>
                            <View style={styles.weightBox}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    value={
                                        item.enteredWeight === ""
                                            ? ""
                                            : String(item.enteredWeight)
                                    }
                                    onChangeText={(text) =>
                                        onWeightChange(
                                            item.setNumber,
                                            text.replace(/[^0-9]/g, "")
                                        )
                                    }
                                    placeholder="--"
                                    placeholderTextColor="#8FA5A0"
                                    maxLength={3}
                                />
                                <Text style={styles.unit}>kg</Text>
                            </View>
                        </View>

                        {/* Reps */}
                        <View style={styles.repsColumn}>
                            <View style={styles.repsBox}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    value={
                                        item.enteredReps === ""
                                            ? String(item.targetReps ?? "")
                                            : String(item.enteredReps)
                                    }
                                    onChangeText={(text) =>
                                        onRepsChange(
                                            item.setNumber,
                                            text.replace(/[^0-9]/g, "")
                                        )
                                    }
                                    placeholder="--"
                                    placeholderTextColor="#8FA5A0"
                                    maxLength={3}
                                />
                            </View>
                        </View>

                    </View>

                    {index !== sets.length - 1 && (
                        <View style={styles.divider} />
                    )}

                </React.Fragment>
            ))}

        </View>
    );
}


const styles = StyleSheet.create({
    // Keep your existing stylesheet exactly as it is.
    container: {
        marginTop: 18,
        backgroundColor: "#163B37",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#214B46",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        height: 46,
    },

    checkboxHeader: {
        width: 30,
        marginRight: 14,
    },

    headerText: {
        color: "#7E9892",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },

    setColumn: {
        width: 42,
        justifyContent: "center",
    },

    weightColumn: {
        flex: 1.2,
        marginRight: 12,
    },

    repsColumn: {
        flex: 0.9,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        height: 74,
        marginHorizontal: 8,
        marginVertical: 4,
        borderRadius: 16,
    },

    completedRow: {
        borderWidth: 2,
        borderColor: "#A3E635",
        borderRadius: 16,
        backgroundColor: "rgba(163,230,53,0.05)",
    },

    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.06)",
        marginHorizontal: 20,
    },

    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 7,
        backgroundColor: "#DCE3F6",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    checkboxCompleted: {
        backgroundColor: "#A3E635",
    },

    checkboxDisabled: {
        opacity: 0.4,
    },

    setNumber: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "700",
    },

    weightBox: {
        height: 44,
        backgroundColor: "#28544F",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },

    repsBox: {
        height: 44,
        backgroundColor: "#28544F",
        borderRadius: 12,
        justifyContent: "center",
        paddingHorizontal: 12,
    },

    input: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
        paddingVertical: 0,
    },

    unit: {
        color: "#B4C5C0",
        fontSize: 13,
        fontWeight: "600",
        marginLeft: 4,
    },

});