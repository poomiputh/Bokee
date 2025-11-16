import React from "react";
import { ImageSourcePropType } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";

export default function ZoomableImage({ source }: { source: ImageSourcePropType }) {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const savedX = useSharedValue(0);
    const savedY = useSharedValue(0);

    // ----- Pinch Gesture -----
    const pinch = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    // ----- Pan Gesture -----
    const pan = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedX.value + e.translationX;
            translateY.value = savedY.value + e.translationY;
        })
        .onEnd(() => {
            savedX.value = translateX.value;
            savedY.value = translateY.value;
        });

    // ----- Combine gestures -----
    const composed = Gesture.Simultaneous(pinch, pan);

    // ----- Animated style -----
    const style = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        };
    });

    return (
        <GestureDetector gesture={composed}>
            <Animated.View style={{ flex: 1, backgroundColor: "black" }}>
                <Animated.Image
                    source={source}
                    style={[{ flex: 1, resizeMode: "contain" }, style]}
                />
            </Animated.View>
        </GestureDetector>
    );
}
