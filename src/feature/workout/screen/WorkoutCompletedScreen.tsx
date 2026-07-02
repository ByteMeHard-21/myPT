import {
    SafeAreaView,
    View,
    Text,
} from "react-native";

export default function WorkoutCompletedScreen() {

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#071A18"
            }}
        >

            <Text
                style={{
                    color: "#A3E635",
                    fontSize: 28,
                    fontWeight: "700"
                }}
            >
                🎉 Workout Complete
            </Text>

            <Text
                style={{
                    color: "white",
                    marginTop: 16,
                    fontSize: 17
                }}
            >
                Great work!
            </Text>

            <Text
                style={{
                    color: "#9CA3AF",
                    marginTop: 12
                }}
            >
                Come back tomorrow for your next workout.
            </Text>

        </SafeAreaView>
    );

}