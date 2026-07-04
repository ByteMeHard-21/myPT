import {
    useEffect,
    useRef,
    useMemo,
    useState,
} from "react";

import { ScrollView } from "react-native";

import {
    askCoach,
    getCoachHistory,
} from "./aiCoach.api";
import { getCurrentWorkout } from "../workout/workout.api";
import { WorkoutOverview } from "../workout/workout.types";
import { ChatMessage } from "./coach.types";
import { buildSuggestions } from "./components/coachSuggestions";
import { useAuthStore } from "../../store/authStore";

export function useCoach() {

    const session =
        useAuthStore(state => state.session);

    const userId =
        session?.user.id;

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [workout, setWorkout] =
        useState<WorkoutOverview | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [historyLoading, setHistoryLoading] =
        useState(true);

    const scrollRef =
        useRef<ScrollView>(null);

    const suggestions =
        useMemo(() =>
            buildSuggestions({

                workoutTitle:
                    workout?.workout?.title,

                focus:
                    workout?.workout?.subtitle,

                isRecoveryDay:
                    workout?.status !== "available",

            }),
            [workout]
        );

    useEffect(() => {

        if (!userId) {
            return;
        }

        void Promise.all([
            loadHistory(),
            loadWorkout(),
        ]);

    }, [userId]);

    async function loadWorkout() {

        if (!userId) {
            return;
        }

        try {

            const data =
                await getCurrentWorkout(userId);

            setWorkout(data);

        } catch (error) {

            console.log(error);

        }

    }

    async function loadHistory() {

        try {

            setHistoryLoading(true);

            const response =
                await getCoachHistory();

            const history: ChatMessage[] =
                response.messages.map(msg => ({
                    id: msg.id,
                    sender:
                        msg.role === "user"
                            ? "user"
                            : "coach",
                    text: msg.message,
                }));

            setMessages(history);

            requestAnimationFrame(() => {

                scrollRef.current?.scrollToEnd({
                    animated: false,
                });

            });

        } catch (error) {

            console.log(error);

        } finally {

            setHistoryLoading(false);

        }

    }

    async function send(customMessage?: string) {
        console.log("customMessage:", customMessage);
        console.log("message state:", message);

        const text = customMessage ?? message;

        console.log("text:", text);
        console.log("typeof:", typeof text);
        console.log("constructor:", text?.constructor?.name);

        if (typeof text !== "string") {
            console.error("send() expected a string but received:", text);
            return;
        }

        if (!text.trim()) {
            return;
        }
        if (loading) {
            return;
        }

        const userMessage: ChatMessage = {

            id: Date.now().toString(),

            sender: "user",

            text,

        };

        setMessages(prev => [
            ...prev,
            userMessage,
        ]);

        setMessage("");

        setLoading(true);

        const typingId =
            `${Date.now()}-typing`;

        setMessages(prev => [
            ...prev,
            {
                id: typingId,
                sender: "coach",
                text: "",
                typing: true,
            },
        ]);

        requestAnimationFrame(() => {
            scrollRef.current?.scrollToEnd({
                animated: true,
            });
        });

        try {

            const response =
                await askCoach(text);

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === typingId
                        ? {
                            ...msg,
                            typing: false,
                            text: response.reply,
                        }
                        : msg
                )
            );

        } catch (error) {
            console.log(error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === typingId
                        ? {
                            ...msg,
                            typing: false,
                            text:
                                "Sorry, I'm having trouble responding right now.",
                        }
                        : msg
                )
            );

        } finally {
            setLoading(false);
            requestAnimationFrame(() => {
                scrollRef.current?.scrollToEnd({
                    animated: true,
                });
            });
        }
    }

    return {
        message,
        setMessage,
        messages,
        loading,
        historyLoading,
        send,
        scrollRef,
        suggestions,
        workout,
    };
}