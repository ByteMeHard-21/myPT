import React, { useEffect, useRef } from "react";
import {
    Animated,
    View,
    Text,
    StyleSheet,
} from "react-native";
import Markdown from "react-native-markdown-display";
import {
    Colors,
    Radius,
    Spacing,
} from "../../workout/theme";
import TypingDots from "./TypingDots";

interface Props {
    sender: "user" | "coach";
    text: string;
    typing?: boolean;
}

export default function ChatBubble({
    sender,
    text,
    typing
}: Props) {
    const opacity =
        useRef(new Animated.Value(0)).current;

    const translateY =
        useRef(new Animated.Value(12)).current;
    const isUser =
        sender === "user";
    useEffect(() => {

        Animated.parallel([

            Animated.timing(opacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true,
            }),

            Animated.timing(translateY, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }),

        ]).start();

    }, []);

    if (typing) {

        return (

            <View
                style={[
                    styles.container,
                    styles.coachContainer,
                ]}
            >

                <View
                    style={[
                        styles.bubble,
                        styles.coachBubble,
                    ]}
                >

                    <TypingDots />

                </View>

            </View>

        );

    }
    return (

        <View
            style={[
                styles.wrapper,
                isUser
                    ? styles.userWrapper
                    : styles.coachWrapper,
            ]}
        >
            <Animated.View
                style={[
                    styles.container,
                    sender === "user"
                        ? styles.userContainer
                        : styles.coachContainer,
                    {
                        opacity,
                        transform: [
                            {
                                translateY,
                            },
                        ],
                    },
                ]}
            >
                <View
                    style={[
                        styles.bubble,
                        isUser
                            ? styles.userBubble
                            : styles.coachBubble,
                    ]}
                >

                    <Markdown style={markdownStyles}>
                        {text}
                    </Markdown>

                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },

    userContainer: {
        alignItems: "flex-end",
    },

    coachContainer: {
        alignItems: "flex-start",
    },

    wrapper: {

        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },

    userWrapper: {
        alignItems: "flex-end",
    },

    coachWrapper: {
        alignItems: "flex-start",
    },

    bubble: {
        maxWidth: "86%",
        borderRadius: Radius.xl,
        padding: 16,
    },

    userBubble: {
        backgroundColor: "#18352F",
    },

    coachBubble: {
        backgroundColor: Colors.surfaceElevated,
    },

    message: {
        color: Colors.text,
        fontSize: 15,
        lineHeight: 24,
    },
});

const markdownStyles = StyleSheet.create({
    body: {
        color: Colors.text,
        fontSize: 15,
        lineHeight: 24,
    },

    paragraph: {
        marginTop: 0,
        marginBottom: 8,
    },

    strong: {
        color: Colors.text,
        fontWeight: "700",
    },

    heading1: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },

    heading2: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },

    heading3: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
    },

    bullet_list: {
        marginVertical: 6,
    },

    ordered_list: {
        marginVertical: 6,
    },

    link: {
        color: Colors.primary,
    },
});