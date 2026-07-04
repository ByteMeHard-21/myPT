import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import Header from "./components/Header";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";

import {
    Colors,
    Radius,
    Spacing,
} from "../workout/theme";
import { useCoach } from "./useCoach";
import { buildSuggestions } from "./components/coachSuggestions";

export default function CoachScreen() {

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning 👋"
            : hour < 18
                ? "Good Afternoon 👋"
                : "Good Evening 👋";

    const {
        message,
        setMessage,
        messages,
        loading,
        historyLoading,
        send,
        scrollRef,
        suggestions,
    } = useCoach();

    return (
        <SafeAreaView style={styles.screen}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
            >
                <View style={{ marginTop: 10 }} />
                <Header />

                <ScrollView
                    ref={scrollRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Greeting */}

                    <View style={styles.greetingSection}>
                        <Text style={styles.title}>
                            {greeting}
                        </Text>

                        <Text style={styles.subtitle}>
                            What can I help you with today?
                        </Text>
                    </View>

                    {/* Suggestions */}

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.suggestionContainer}
                    >
                        {suggestions.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.chip}
                                activeOpacity={0.85}
                                onPress={() => send(item.prompt)}
                            >
                                <Text style={styles.chipText}>
                                    {item.title}
                                </Text>

                                <Text style={styles.arrow}>
                                    ›
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Conversation */}
                    <View style={styles.chatContainer}>

                        {messages.length === 0 ? (

                            <View style={styles.emptyState}>

                                <Text style={styles.emptyTitle}>
                                    👋 Welcome to FitAI
                                </Text>

                                <Text style={styles.emptyDescription}>
                                    Ask anything about your workouts,
                                    nutrition, recovery, exercise form,
                                    or fitness goals.
                                </Text>

                            </View>

                        ) : (

                            messages.map(item => (
                                <ChatBubble
                                    key={item.id}
                                    sender={item.sender}
                                    text={item.text}
                                    typing={item.typing}
                                />
                            ))

                        )}

                    </View>

                    {/* Typing */}
                </ScrollView>
                <ChatInput
                    value={message}
                    onChangeText={setMessage}
                    onSend={send}
                />

            </KeyboardAvoidingView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    scrollView: {
        flex: 1,
    },

    content: {
        paddingTop: Spacing.lg,
        paddingBottom: 110,
    },

    greetingSection: {
        paddingHorizontal: Spacing.lg,
    },

    title: {
        fontSize: 34,
        fontWeight: "800",
        color: Colors.text,
    },

    subtitle: {
        marginTop: 8,
        fontSize: 15,
        color: Colors.subText,
    },

    suggestionContainer: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: 24,
    },

    chip: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: Colors.surfaceElevated,

        borderWidth: 1,

        borderColor: Colors.border,

        borderRadius: Radius.pill,

        paddingHorizontal: 16,

        paddingVertical: 10,

        marginRight: 12,
    },

    chipText: {
        color: Colors.text,
        fontWeight: "600",
        fontSize: 13,
    },

    arrow: {
        marginLeft: 8,
        color: Colors.primary,
        fontWeight: "700",
        fontSize: 16,
    },

    chatContainer: {
        marginTop: 6,
    },

    typingRow: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: Spacing.lg,

        marginTop: Spacing.md,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginRight: 10,
    },

    typingText: {
        color: Colors.subText,
        fontSize: 12,
    },

    emptyState: {
        paddingHorizontal: Spacing.lg,
        marginTop: 40,
        alignItems: "center",
    },

    emptyTitle: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: "700",
    },

    emptyDescription: {
        marginTop: 12,
        color: Colors.subText,
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
    },
});