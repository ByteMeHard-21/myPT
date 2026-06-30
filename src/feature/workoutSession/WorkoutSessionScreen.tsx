import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal
} from "react-native";
import { Fullscreen } from "lucide-react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import WorkoutHeader from "./components/WorkoutHeader";
import SetTracker, { SetData } from "./components/SetTracker";
import WorkoutAccordion from "./components/WorkoutAccordion";

export default function WorkoutSessionScreen() {
    const [sets, setSets] = useState<SetData[]>([
        {
            set: 1,
            weight: 55,
            reps: 10,
            completed: true,
        },
        {
            set: 2,
            weight: 55,
            reps: 10,
            completed: false,
        },
        {
            set: 3,
            weight: "",
            reps: "",
            completed: false,
        },
        {
            set: 4,
            weight: "",
            reps: "",
            completed: false,
        },
    ]);
    const [showFullscreenGif, setShowFullscreenGif] = useState(false);

    const toggleSet = (setNumber: number) => {
        setSets((prev) =>
            prev.map((item) =>
                item.set === setNumber
                    ? {
                        ...item,
                        completed: !item.completed,
                    }
                    : item
            )
        );
    };

    const onWeightChange = (setNumber: number, value: string) => {
        setSets((prev) =>
            prev.map((item) =>
                item.set === setNumber
                    ? {
                        ...item,
                        weight: value === "" ? "" : Number(value),
                    }
                    : item
            )
        );
    };

    const onRepsChange = (setNumber: number, value: string) => {
        setSets((prev) =>
            prev.map((item) =>
                item.set === setNumber
                    ? {
                        ...item,
                        reps: value === "" ? "" : Number(value),
                    }
                    : item
            )
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 20 }} />
            <WorkoutHeader
                workoutName="Push Day"
                currentExercise={3}
                totalExercises={8}
                onBackPress={() => { }}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Exercise Card */}

                <View style={styles.exerciseCard}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require("../../../assets/workout/lat_pulldown.gif")}
                            style={styles.image}
                            resizeMode="contain"
                        />

                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => setShowFullscreenGif(true)}
                        >
                            <Fullscreen
                                size={22}
                                color="#FFFFFF"
                                strokeWidth={2.2}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.exerciseInfo}>
                        <View style={styles.titleRow}>
                            <Text style={styles.exerciseName}>
                                Bench Press
                            </Text>

                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>
                                    Beginner
                                </Text>
                            </View>
                        </View>

                        <View style={styles.tags}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Chest</Text>
                            </View>

                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Front Delts</Text>
                            </View>

                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Triceps</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Coach */}

                <View style={styles.coachCard}>
                    <View style={styles.coachHeader}>
                        <View style={styles.coachIcon}>
                            <MaterialCommunityIcons
                                name="lightbulb-outline"
                                size={16}
                                color="#082320"
                            />
                        </View>

                        <Text style={styles.coachTitle}>
                            Coach Tip
                        </Text>
                    </View>

                    <Text style={styles.coachText}>
                        Keep your shoulder blades retracted
                        throughout the movement to maximize
                        chest activation.
                    </Text>
                </View>

                {/* Sets */}

                <SetTracker
                    sets={sets}
                    onToggleSet={toggleSet}
                    onWeightChange={onWeightChange}
                    onRepsChange={onRepsChange}
                />

                {/* Accordions */}

                <WorkoutAccordion
                    title="Instructions"
                    content="1. Lie flat on the bench.
2. Grip the bar slightly wider than shoulder width.
3. Lower the bar to your chest.
4. Press back up while exhaling."
                />

                <WorkoutAccordion
                    title="Common Mistakes"
                    content="• Bouncing the bar
• Flaring elbows too much
• Lifting hips off the bench
• Locking elbows aggressively"
                />

                {/* Bottom Buttons */}

                {/* Secondary Actions */}
                <View style={styles.sectionDivider} />
                <View style={styles.actionContainer}>

                    <Text style={styles.actionTitle}>
                        ACTIONS
                    </Text>
                    <View style={styles.secondaryActionRow}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.secondaryButton}
                        >
                            <Ionicons
                                name="sparkles"
                                size={20}
                                color="#A3E635"
                            />

                            <Text style={styles.secondaryButtonText}>
                                Ask AI
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.secondaryButton}
                        >
                            <Ionicons
                                name="swap-horizontal"
                                size={20}
                                color="#A3E635"
                            />

                            <Text style={styles.secondaryButtonText}>
                                Swap Exercise
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Primary Actions */}

                    <View style={styles.primaryActionRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.skipButton}
                        >
                            <Ionicons
                                name="play-skip-forward-outline"
                                size={20}
                                color="rgba(255,255,255,0.75)"
                            />

                            <Text style={styles.skipText}>
                                Skip
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.nextButton}
                        >
                            <Text style={styles.nextText}>
                                Next Exercise
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={22}
                                color="#082320"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Pause */}

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.pauseButton}
                    >
                        <Ionicons
                            name="pause-circle-outline"
                            size={18}
                            color="rgba(255,255,255,0.45)"
                        />

                        <Text style={styles.pauseText}>
                            Pause & Exit
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showFullscreenGif}
                    animationType="fade"
                    transparent={false}
                >
                    <View style={styles.fullscreenContainer}>
                        <View style={styles.fullscreenHeader}>
                            <TouchableOpacity
                                onPress={() => setShowFullscreenGif(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>

                            <Text style={styles.fullscreenTitle}>
                                Bench Press
                            </Text>
                        </View>

                        <Image
                            source={require("../../../assets/workout/lat_pulldown.gif")}
                            resizeMode="contain"
                            style={styles.fullscreenImage}
                        />
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#082320",
    },

    content: {
        padding: 10,
        paddingBottom: 40,
    },

    exerciseCard: {
        backgroundColor: "#173C38",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#2A4B45",
        overflow: "hidden",
    },

    imageContainer: {
        height: 260,
        backgroundColor: "#102E2C",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#2A4B45",
        position: "relative",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    menuButton: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(23,60,56,0.80)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        justifyContent: "center",
        alignItems: "center",
    },

    exerciseInfo: {
        paddingHorizontal: 10,
        paddingVertical: 18,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },


    exerciseName: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        marginRight: 12,
    },

    bottomRow: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 16,
    },

    tag: {
        height: 32,
        backgroundColor: "#21504A",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2A4B45",
        justifyContent: "center",
        paddingHorizontal: 14,
        marginRight: 10,
        marginBottom: 10,
    },

    tagText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },

    levelBadge: {
        backgroundColor: "rgba(163,230,53,0.15)",
        borderColor: "#A3E635",
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 30,
    },
    levelText: {
        color: "#A3E635",
        fontSize: 12,
        fontWeight: "700",
    },

    coachCard: {
        marginTop: 18,
        backgroundColor: "#173C38",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#2A4B45",
        padding: 16,
    },

    coachHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    sectionDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        marginTop: 26,
        marginBottom: 26,
    },

    actionContainer: {
        backgroundColor: "#102E2C",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#2A4B45",
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        elevation: 6,
    },

    actionTitle: {
        color: "rgba(255,255,255,0.45)",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 2,
        marginBottom: 18,
    },


    coachIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#A3E635",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    coachTitle: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
    },

    coachText: {
        color: "rgba(255,255,255,0.65)",
        lineHeight: 22,
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },

    secondaryButton: {
        width: "48%",
        height: 56,
        backgroundColor: "#2B5953",
        borderRadius: 18,

        borderWidth: 1,
        borderColor: "#2A4B45",

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",

        shadowOpacity: .12,

        shadowRadius: 10,

        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    secondaryText: {
        color: "#FFFFFF",
        marginLeft: 8,
        fontWeight: "600",
    },

    bottomRowButtons: {
        marginTop: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    skip: {
        color: "rgba(255,255,255,0.5)",
        textDecorationLine: "underline",
    },

    nextButton: {
        width: "71%",
        height: 56,

        borderRadius: 18,

        backgroundColor: "#A3E635",

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#A3E635",
        shadowOpacity: 0.18,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 8,
        },

        elevation: 6,
    },

    nextText: {
        color: "#082320",
        fontWeight: "700",
        fontSize: 16,
        marginRight: 8,
    },

    exit: {
        marginTop: 30,
        color: "#EF4444",
        textAlign: "center",
        fontWeight: "600",
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: "#082320",
    },

    fullscreenHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        gap: 12,
    },

    closeButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
    },

    fullscreenTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },

    fullscreenImage: {
        flex: 1,
        width: "100%",
        height: undefined,
    },
    secondaryActionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 26,
    },



    secondaryButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 8,
    },

    primaryActionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginTop: 22,
    },

    skipButton: {
        width: "25%",
        height: 54,

        borderRadius: 18,

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",

        backgroundColor: "transparent",

        justifyContent: "center",
        alignItems: "center",
    },

    skipText: {
        marginTop: 2,
        color: "rgba(255,255,255,0.75)",
        fontSize: 12,
        fontWeight: "600",
    },


    pauseButton: {
        marginTop: 24,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    pauseText: {
        marginLeft: 6,

        color: "rgba(255,255,255,0.45)",

        fontSize: 14,

        fontWeight: "600",
    },
});