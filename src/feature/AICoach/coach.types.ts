export interface Suggestion {
    id: string;
    title: string;
}

export interface Message {
    id: string;
    sender: "user" | "coach";
    text: string;
}

export interface CoachConversation {
    suggestions: Suggestion[];
    messages: Message[];
}

export interface ChatMessage {
    id: string;
    sender: "user" | "coach";
    text: string;
    typing?: boolean;
}

export interface Suggestion {
    id: string;
    title: string;
}

export interface CoachSuggestion {
    id: string;
    title: string;
    prompt: string;
}