import React, { useCallback, useMemo, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ITEM_WIDTH = 56;
const VISIBLE_SIDE_ITEMS = 3;

interface HorizontalWheelPickerProps {
    values: number[];
    selectedValue: number;
    onChange: (value: number) => void;
    containerWidth?: number;
}

export default function HorizontalWheelPicker({
    values,
    selectedValue,
    onChange,
    containerWidth,
}: HorizontalWheelPickerProps) {
    const width = containerWidth ?? SCREEN_WIDTH - 80;
    const sidePadding = width / 2 - ITEM_WIDTH / 2;

    const scrollX = useSharedValue(0);
    const listRef = useRef<any>(null);

    const initialIndex = useMemo(
        () => Math.max(0, values.indexOf(selectedValue)),
        [values, selectedValue]
    );

    const lastSelectedIndex = useRef(initialIndex);

    const triggerSelection = useCallback(
        (index: number) => {
            const clamped = Math.max(
                0,
                Math.min(values.length - 1, index)
            );

            if (lastSelectedIndex.current === clamped) {
                return;
            }

            lastSelectedIndex.current = clamped;

            Haptics.selectionAsync().catch(() => { });

            onChange(values[clamped]);
        },
        [values, onChange]
    );

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const offset = event.contentOffset.x;

            scrollX.value = offset;

            // More responsive than plain Math.round()
            const index = Math.round(
                (offset + ITEM_WIDTH * 0.25) / ITEM_WIDTH
            );

            runOnJS(triggerSelection)(index);
        },
    });

    const getItemLayout = useCallback(
        (_: unknown, index: number) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
        }),
        []
    );

    return (
        <View style={[styles.wrapper, { width }]}>
            <View pointerEvents="none" style={styles.ringContainer}>
                <View style={styles.ring} />
            </View>

            <Animated.FlatList
                ref={listRef}
                data={values}
                keyExtractor={(item) => `age-${item}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                decelerationRate="fast"
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="start"
                contentContainerStyle={{
                    paddingHorizontal: sidePadding,
                }}
                getItemLayout={getItemLayout}
                initialScrollIndex={initialIndex}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => (
                    <WheelItem
                        value={item}
                        index={index}
                        scrollX={scrollX}
                        itemWidth={ITEM_WIDTH}
                    />
                )}
            />
        </View>
    );
}

interface WheelItemProps {
    value: number;
    index: number;
    scrollX: SharedValue<number>;
    itemWidth: number;
}

function WheelItem({
    value,
    index,
    scrollX,
    itemWidth,
}: WheelItemProps) {
    const animatedStyle = useAnimatedStyle(() => {
        const itemCenter = index * itemWidth;

        const distance =
            (scrollX.value - itemCenter) / itemWidth;

        const scale = interpolate(
            distance,
            [-2, -1, 0, 1, 2],
            [0.72, 0.85, 1.3, 0.85, 0.72],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            distance,
            [-VISIBLE_SIDE_ITEMS, -1.2, 0, 1.2, VISIBLE_SIDE_ITEMS],
            [0, 0.35, 1, 0.35, 0],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            distance,
            [-2, 0, 2],
            [6, 0, 6],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [
                { scale },
                { translateY },
            ],
        };
    });

    const textStyle = useAnimatedStyle(() => {
        const itemCenter = index * itemWidth;

        const distance = Math.abs(
            (scrollX.value - itemCenter) / itemWidth
        );

        return {
            color:
                distance < 0.2
                    ? "#A3E635"
                    : "rgba(255,255,255,0.4)",
        };
    });

    return (
        <View
            style={[
                styles.itemContainer,
                { width: itemWidth },
            ]}
        >
            <Animated.Text
                style={[
                    styles.itemText,
                    animatedStyle,
                    textStyle,
                ]}
            >
                {value}
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 88,
        justifyContent: "center",
        alignSelf: "center",
    },

    ringContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    ring: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: "#A3E635",

        shadowColor: "#A3E635",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },

        elevation: 6,
    },

    itemContainer: {
        height: 88,
        justifyContent: "center",
        alignItems: "center",
    },

    itemText: {
        fontSize: 20,
        fontWeight: "700",
    },
});