import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing } from "../theme";
import { WorkoutExercise } from "../workout.types";

const { width } = Dimensions.get("window");

const CARD_GAP = 14;
const HORIZONTAL_PADDING = 55;

const CARD_WIDTH =
    (width - HORIZONTAL_PADDING - CARD_GAP) / 2;

const INITIAL_ROWS = 3;
const ITEMS_PER_ROW = 2;
const INITIAL_VISIBLE = INITIAL_ROWS * ITEMS_PER_ROW;

const exercises = [
    {
        id: "1",
        name: "Bench Dip",
        image: require("../../../../assets/workout/bench-dip.jpg"),
    },
    {
        id: "2",
        name: "Concentration Curls",
        image: require("../../../../assets/workout/concentration-curl.jpg"),
    },
    {
        id: "3",
        name: "Cable Tricep",
        image: require("../../../../assets/workout/cable-tricep-kickback.jpg"),
    },
    {
        id: "4",
        name: "Dumbbell Shrug",
        image: require("../../../../assets/workout/dumbbell-shrug.jpg"),
    },
    {
        id: "5",
        name: "ez-Barbell Curls",
        image: require("../../../../assets/workout/ez-bar-curl.jpg"),
    },
    {
        id: "6",
        name: "Glute Bridge",
        image: require("../../../../assets/workout/glute-bridge.jpg"),
    },
    {
        id: "7",
        name: "Side Plank",
        image: require("../../../../assets/workout/side-plank.jpg"),
    },
    {
        id: "8",
        name: "Sumo Squat",
        image: require("../../../../assets/workout/sumo-squat.jpg"),
    },
];

interface Props {
    exercises: WorkoutExercise[];
}

const ExerciseCards = ({
    exercises,
}: Props) => {
    const [expanded, setExpanded] = useState(false);

    const visibleExercises = useMemo(() => {
        if (expanded) return exercises;
        return exercises.slice(0, INITIAL_VISIBLE);
    }, [expanded]);
    const PLACEHOLDER = require("../../../../assets/images/placeholder_img.jpg");

    const renderItem = ({ item }: any) => (
        <View style={styles.card} >
            <Image
                source={
                    item.thumbnailUrl
                        ? {
                            uri: item.thumbnailUrl,
                        }
                        : PLACEHOLDER
                }
                style={styles.image}
            />

            <View style={styles.footer}>
                <Text
                    numberOfLines={2}
                    style={styles.name}
                >
                    {item.name}
                </Text>
            </View>
        </View>
    );

    return (
        <>
            <FlatList
                data={visibleExercises}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
            />

            {exercises.length > INITIAL_VISIBLE && (
                <View style={styles.expandContainer}>
                    <View style={styles.line} />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.expand}
                        onPress={() => setExpanded(!expanded)}
                    >
                        <Ionicons
                            name={expanded ? "chevron-up" : "chevron-down"}
                            size={18}
                            color={Colors.subText}
                        />

                        <Text style={styles.expandText}>
                            {expanded ? "View Less" : "View More"}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.line} />
                </View>
            )}
        </>
    );
};

export default React.memo(ExerciseCards);

const styles = StyleSheet.create({
    row: {
        justifyContent: "space-between",
        marginBottom: Spacing.lg,
    },

    card: {
        width: CARD_WIDTH,
        height: 210,
        backgroundColor: Colors.surface,
        borderRadius: Radius.xl,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.border,
    },

    image: {
        width: "100%",
        height: "80%",
        resizeMode: "cover",
    },

    footer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: Spacing.md,
    },

    name: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },

    expandContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
        marginBottom: 6,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },

    expand: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        width: 152,
        height: 40,

        backgroundColor: Colors.border,

        borderRadius: 20,
    },

    expandButton: {
        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 14,
    },

    expandText: {
        marginLeft: 5,

        color: Colors.subText,

        fontSize: 14,

        fontWeight: "600",
    },
});