import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface SetData {
    set: number;
    weight: number | "";
    reps: number | "";
    completed: boolean;
}

interface Props {
    sets: SetData[];
    onToggleSet: (setNumber: number) => void;
    onWeightChange: (setNumber: number, value: string) => void;
    onRepsChange: (setNumber: number, value: string) => void;
}

export default function SetTracker({
    sets,
    onToggleSet,
    onWeightChange,
    onRepsChange,
}: Props) {

    const [activeRow, setActiveRow] = useState<number | null>(null);
    useEffect(() => {
        const lastCompleted = sets
            .filter((item) => item.completed)
            .map((item) => item.set)
            .pop(); // get most recent completed set

        if (!lastCompleted) return;

        setActiveRow(lastCompleted);

        const timer = setTimeout(() => {
            setActiveRow(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [sets]);

    const isRowComplete = (item: SetData) => {
        return (
            item.weight !== "" &&
            item.reps !== "" &&
            Number(item.weight) > 0 &&
            Number(item.reps) > 0
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
                <React.Fragment key={item.set}>
                    <View
                        style={[
                            styles.row,
                            activeRow === item.set &&
                            styles.completedRow,
                        ]}
                    >
                        {/* Checkbox */}
                        <TouchableOpacity
                            disabled={!isRowComplete(item)}
                            onPress={() => {
                                onToggleSet(item.set);

                                // Show border only for the currently completed row
                                setActiveRow(item.set);

                                setTimeout(() => {
                                    setActiveRow((current) =>
                                        current === item.set ? null : current
                                    );
                                }, 5000);
                            }}
                            style={[
                                styles.checkbox,
                                item.completed && styles.checkboxCompleted,
                                !isRowComplete(item) && styles.checkboxDisabled,
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
                            <Text style={styles.setNumber}>{item.set}</Text>
                        </View>

                        {/* Weight */}
                        <View style={styles.weightColumn}>
                            <View style={styles.weightBox}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    value={
                                        item.weight === "" ? "" : String(item.weight)
                                    }
                                    onChangeText={(text) =>
                                        onWeightChange(
                                            item.set,
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
                                    value={item.reps === "" ? "" : String(item.reps)}
                                    onChangeText={(text) =>
                                        onRepsChange(
                                            item.set,
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