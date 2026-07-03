import React from "react";
import {
    View,
    StyleSheet,
} from "react-native";

import {
    Colors,
    Radius,
} from "../../workout/theme";

interface Props {
    progress: number; // value between 0 and 1
}

export default function ProgressBar({
    progress,
}: Props) {
    return (
        <View style={styles.track}>
            <View
                style={[
                    styles.fill,
                    {
                        width: `${Math.min(
                            Math.max(progress, 0),
                            1
                        ) * 100}%`,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        width: "100%",

        height: 8,

        backgroundColor: Colors.border,

        borderRadius: Radius.pill,

        overflow: "hidden",
    },

    fill: {
        height: "100%",

        backgroundColor: Colors.primary,

        borderRadius: Radius.pill,
    },
});