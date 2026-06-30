import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import { MapPin, ChevronRight, Zap, } from "lucide-react-native";

import Header from "../components/Header";
import Calendar from "../components/Calendar";

import RecoveryHeroCard from "../components/RecoveryHeroCard";
import SuggestionsSection from "../components/SuggestionsSection";

export default function RecoveryScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Header />

                <Calendar />

                <RecoveryHeroCard />

                <SuggestionsSection />

                {/* Recovery Info Card */}
                <View style={styles.card}>
                    <View style={styles.header}>
                        <View style={styles.icon}>
                            <Zap size={16} color="#0B2D2A" />
                        </View>

                        <Text style={styles.heading}>
                            Coach Insight
                        </Text>
                    </View>

                    <Text style={styles.body}>
                        Yesterday's upper-body session was intense.
                        {"\n\n"}
                        Recovery today helps maximize muscle growth
                        and prepares you for tomorrow's Push Day.
                    </Text>
                </View>

                {/* Next Workout Card */}
                <TouchableOpacity style={styles.workoutCard}>
                    <View>
                        <Text style={styles.small}>Next Workout</Text>

                        <Text style={styles.title}>
                            Push Day • Tomorrow
                        </Text>
                    </View>

                    <ChevronRight size={22} color="#fff" />
                </TouchableOpacity>

                {/* Button */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Weekly Plan</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B2D2A",
    },

    content: {
        paddingHorizontal: 18,
        paddingBottom: 30,
    },

    // Recovery Info Card
    infoCard: {
        marginTop: 18,
        backgroundColor: "#19413C",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2A4B45",
        padding: 15,
        flexDirection: "row",
        alignItems: "flex-start",
    },

    icon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#A3E635",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    infoText: {
        flex: 1,
        color: "rgba(255,255,255,0.65)",
        lineHeight: 21,
        fontSize: 14,
    },

    // Next Workout Card
    workoutCard: {
        marginTop: 18,
        backgroundColor: "#19413C",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2A4B45",
        padding: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    small: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 12,
        marginBottom: 4,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    // Button
    button: {
        marginTop: 22,
        backgroundColor: "#A3E635",
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
        color: "#0B2D2A",
        fontSize: 16,
        fontWeight: "700",
    },
    card: {
        marginTop: 22,
        backgroundColor: "#19413C",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#2A4B45",
        padding: 18,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    //   icon: {
    //     width: 28,
    //     height: 28,
    //     borderRadius: 14,
    //     backgroundColor: "#A3E635",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     marginRight: 10,
    //   },

    heading: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    body: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 14,
        lineHeight: 22,
    },
});