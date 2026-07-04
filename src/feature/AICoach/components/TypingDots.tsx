import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    View,
} from "react-native";

import { Colors } from "../../workout/theme";

interface DotProps {
    delay: number;
}

function Dot({ delay }: DotProps) {

    const opacity =
        useRef(new Animated.Value(0.3)).current;

    useEffect(() => {

        const animation =
            Animated.loop(

                Animated.sequence([

                    Animated.delay(delay),

                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 250,
                        useNativeDriver: true,
                    }),

                    Animated.timing(opacity, {
                        toValue: 0.3,
                        duration: 250,
                        useNativeDriver: true,
                    }),

                ])

            );

        animation.start();

        return () => animation.stop();

    }, []);

    return (
        <Animated.View
            style={[
                styles.dot,
                { opacity },
            ]}
        />
    );

}

export default function TypingDots() {

    return (

        <View style={styles.row}>

            <Dot delay={0} />

            <Dot delay={150} />

            <Dot delay={300} />

        </View>

    );

}

const styles = StyleSheet.create({

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginHorizontal: 3,
    },

});