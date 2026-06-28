import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import { Colors, Radius } from "../../src/feature/workout/theme"

const TabIcon = ({
    focused,
    icon,
    label,
}: {
    focused: boolean;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
}) => {
    return (
        <View
            style={[
                styles.tab,
                focused && styles.activeTab,
            ]}
        >
            <Ionicons
                name={icon}
                size={20}
                color={
                    focused
                        ? Colors.background
                        : Colors.subText
                }
            />

            <Text
                style={[
                    styles.label,
                    focused && styles.activeLabel,
                ]}
            >
                {label}
            </Text>
        </View>
    );
};

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarShowLabel: false,

                tabBarStyle: styles.tabBar,
            }}
        >
            <Tabs.Screen
                name="workout"
                options={{
                    title: "Workout",

                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="barbell-outline"
                            label="Workout"
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="coach"
                options={{
                    title: "Coach",

                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="sparkles-outline"
                            label="Coach"
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="analysis"
                options={{
                    title: "Analysis",

                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="stats-chart-outline"
                            label="Analysis"
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",

                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="person-outline"
                            label="Profile"
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.surface,

        borderTopWidth: 1,

        borderTopColor: Colors.border,

        height: 82,

        paddingBottom: 10,

        paddingTop: 8,
    },

    tab: {
        width: 74,

        height: 44,

        borderRadius: Radius.pill,

        justifyContent: "center",

        alignItems: "center",
    },

    activeTab: {
        backgroundColor: Colors.primary,
    },

    label: {
        marginTop: 2,

        fontSize: 11,

        color: Colors.subText,

        fontWeight: "600",
    },

    activeLabel: {
        color: Colors.background,
    },
});