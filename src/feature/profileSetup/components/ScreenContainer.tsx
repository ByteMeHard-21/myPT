import React, { ReactNode } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { COLORS } from '../constant/colors';

interface Props {
    children: ReactNode;
}

const ScreenContainer = ({ children }: Props) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ScreenContainer;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 20,
        marginTop: 40,
    },
});