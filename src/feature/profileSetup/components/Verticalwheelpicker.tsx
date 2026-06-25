/**
 * VerticalWheelPicker.tsx
 * -----------------------------------------------------------------------
 * Slot-machine style vertical wheel used for Height and Weight. Unlike
 * the Age wheel's ring-on-top treatment, the selection here is a solid
 * highlighted track that the centered number sits inside — visually
 * distinct on purpose, matching the reference image's two different
 * selection idioms.
 */
import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolation,
    SharedValue,
    runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const ITEM_HEIGHT = 40;
const VISIBLE_SIDE_ITEMS = 2;
const WHEEL_HEIGHT = ITEM_HEIGHT * (VISIBLE_SIDE_ITEMS * 2 + 1); // 5 rows visible

interface VerticalWheelPickerProps {
    values: number[];
    selectedValue: number;
    onChange: (value: number) => void;
}

export default function VerticalWheelPicker({
    values,
    selectedValue,
    onChange,
}: VerticalWheelPickerProps) {
    const scrollY = useSharedValue(0);
    const listRef = useRef<Animated.FlatList<number>>(null);
    const lastHapticIndex = useRef<number>(values.indexOf(selectedValue));

    const initialIndex = useMemo(
        () => Math.max(0, values.indexOf(selectedValue)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const sidePadding = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;

    const triggerHaptic = useCallback((index: number) => {
        if (lastHapticIndex.current !== index) {
            lastHapticIndex.current = index;
            Haptics.selectionAsync().catch(() => { });
        }
    }, []);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const offset = event.contentOffset.y;

            scrollY.value = offset;

            const index = Math.round(offset / ITEM_HEIGHT);

            runOnJS(triggerHaptic)(index);
        },
    });

    const handleMomentumEnd = useCallback(
        (e: any) => {
            const offset = e.nativeEvent.contentOffset.y;
            const index = Math.round(offset / ITEM_HEIGHT);
            const clamped = Math.max(0, Math.min(values.length - 1, index));
            const value = values[clamped];
            if (value !== selectedValue) {
                onChange(value);
            }
        },
        [values, selectedValue, onChange]
    );

    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        []
    );

    return (
        <View style={styles.wrapper}>
            {/* Highlighted center track — sits behind the scrolling numbers */}
            <View pointerEvents="none" style={styles.trackContainer}>
                <View style={styles.track} />
            </View>

            <Animated.FlatList
                ref={listRef}
                data={values}
                keyExtractor={(item) => `v-${item}`}
                showsVerticalScrollIndicator={false}
                bounces={false}
                decelerationRate="fast"
                snapToInterval={ITEM_HEIGHT}
                snapToAlignment="start"
                contentContainerStyle={{
                    paddingVertical: sidePadding,
                }}
                style={{ height: WHEEL_HEIGHT }}
                getItemLayout={getItemLayout}
                initialScrollIndex={initialIndex}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                onMomentumScrollEnd={handleMomentumEnd}
                renderItem={({ item, index }) => (
                    <WheelRow
                        value={item}
                        index={index}
                        scrollY={scrollY}
                        itemHeight={ITEM_HEIGHT}
                    />
                )}
            />
        </View>
    );
}

interface WheelRowProps {
    value: number;
    index: number;
    scrollY: SharedValue<number>;
    itemHeight: number;
}

function WheelRow({ value, index, scrollY, itemHeight }: WheelRowProps) {
    const animatedStyle = useAnimatedStyle(() => {
        const itemCenter = index * itemHeight;
        const distance = (scrollY.value - itemCenter) / itemHeight;

        const scale = interpolate(
            distance,
            [-2, -1, 0, 1, 2],
            [0.75, 0.88, 1.2, 0.88, 0.75],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            distance,
            [-VISIBLE_SIDE_ITEMS, -1, 0, 1, VISIBLE_SIDE_ITEMS],
            [0, 0.4, 1, 0.4, 0],
            Extrapolation.CLAMP
        );

        // Slight horizontal compression on neighbors for a cylindrical feel
        const translateX = interpolate(
            distance,
            [-2, 0, 2],
            [4, 0, 4],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ scale }, { translateX }] as any,
        };
    });

    const colorStyle = useAnimatedStyle(() => {
        const itemCenter = index * itemHeight;
        const distance = Math.abs((scrollY.value - itemCenter) / itemHeight);
        const isCentered = distance < 0.2;
        return {
            color: isCentered ? "#0B1110" : "rgba(255,255,255,0.4)",
            fontWeight: isCentered ? "800" : "600",
        } as any;
    });

    return (
        <View style={[styles.rowContainer, { height: itemHeight }]}>
            <Animated.Text style={[styles.rowText, animatedStyle, colorStyle]}>
                {value}
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: WHEEL_HEIGHT,
        justifyContent: "center",
        width: "100%",
    },

    trackContainer: {
        position: "absolute",
        left: 8,
        right: 8,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    track: {
        width: "100%",
        height: ITEM_HEIGHT,
        borderRadius: 12,
        backgroundColor: "rgba(163,230,53,0.9)",
        shadowColor: "#A3E635",
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
    },

    rowContainer: {
        justifyContent: "center",
        alignItems: "center",
    },

    rowText: {
        fontSize: 17,
        textAlign: "center",
    },
});