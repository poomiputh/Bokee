import { parseSource } from "@/utils/imageUtils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import { Dimensions, GestureResponderEvent, Image, PanResponder, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Page() {
    const { bookId, page } = useLocalSearchParams<{ bookId: string, page: string }>();

    const router = useRouter();
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const back = () => {
        const toPage = Math.max(1, parseInt(page) - 1);
        router.replace(`/book/${bookId}/${toPage}`);
    };

    const next = () => {
        const toPage = Math.max(1, parseInt(page) + 1);
        router.replace(`/book/${bookId}/${toPage}`);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
            onPanResponderRelease: (evt: GestureResponderEvent, gestureState) => {
                // Swipe
                if (gestureState.dx > 50) back();
                else if (gestureState.dx < -50) next();
                else {
                    // Tap
                    const sectionWidth = SCREEN_WIDTH / 3;
                    const x = evt.nativeEvent.locationX;
                    if (x < sectionWidth) back();
                    else if (x > sectionWidth * 2) next();
                    else console.log("Tap middle section");
                }
            },
        })
    ).current;

    return (
        <View {...panResponder.panHandlers} style={{ flex: 1 }}>
            <Image
                style={{
                    flex: 1,
                    backgroundColor: "black",
                }}
                source={parseSource(`${apiUrl}/Get/Book/${bookId}/${page}`)}
                resizeMode="contain"
                fadeDuration={0}
            />
        </View>
    );
}