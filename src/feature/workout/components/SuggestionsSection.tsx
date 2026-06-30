import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import SuggestionCard from "./SuggestionCard";

const suggestions = [
    {
        title: "Stretch",
        duration: "10–15 min",
        image: require("../../../../assets/images/placeholder_img.jpg"),
    },
    {
        title: "Light Walk",
        duration: "20 min",
        image: require("../../../../assets/images/placeholder_img.jpg"),
    },
    {
        title: "Hydration",
        description: "Drink Water",
        image: require("../../../../assets/images/placeholder_img.jpg"),
    },
];

export default function SuggestionsSection() {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Today's Suggestions</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {suggestions.map((item, index) => (
                    <SuggestionCard key={index} {...item} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
    },

    heading: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },

    scroll: {
        paddingRight: 18,
    },
});