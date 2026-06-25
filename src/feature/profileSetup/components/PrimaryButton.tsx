import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { COLORS } from '../constant/colors';

interface Props {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

const PrimaryButton = ({
    title,
    onPress,
    loading,
    disabled,
}: Props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            disabled={disabled || loading}
            onPress={onPress}
            style={[
                styles.button,
                disabled && styles.disabled,
            ]}>
            {loading ? (
                <ActivityIndicator color={COLORS.background} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default PrimaryButton;

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: '700',
    },

    disabled: {
        opacity: 0.5,
    },
});