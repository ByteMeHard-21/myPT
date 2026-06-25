import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS } from '../constant/colors';

interface Props {
    step: number;
    totalSteps: number;
}

const ProgressHeader = ({ step, totalSteps }: Props) => {
    const progress = (step / totalSteps) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.stepText}>
                    Step {step} of {totalSteps}
                </Text>

                <Text style={styles.percentText}>
                    {Math.round(progress)}%
                </Text>
            </View>

            <View style={styles.track}>
                <View
                    style={[
                        styles.fill,
                        {
                            width: `${progress}%`,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

export default ProgressHeader;

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        marginBottom: 32,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    stepText: {
        color: COLORS.textMuted,
        fontSize: 12,
    },

    percentText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '700',
    },

    track: {
        height: 8,
        backgroundColor: COLORS.progressTrack,
        borderRadius: 999,
        overflow: 'hidden',
    },

    fill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
});