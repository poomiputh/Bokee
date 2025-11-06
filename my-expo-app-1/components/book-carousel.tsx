import { Book } from "@/types/Book";
import { parseSource } from "@/utils/imageUtils";
import React, { useRef } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import AppText from "./texts/app-text";

export type BookCarouselProps = {
    data: Book[]
    coverWidth?: number;
    coverHeight?: number;
    itemWidthModifier?: number;
    onPress?: (book: Book) => void;
};

const defaultProps = {
    coverWidth: 150,
    coverHeight: 300,
    itemWidthModifier: 0.6,
}

export default function BookCarousel(props: BookCarouselProps) {
    const mergedProps = { ...defaultProps, ...props };

    const { width } = Dimensions.get("window");
    const VISIBLE_WIDTH = width;
    const ITEM_WIDTH = Math.round(width * mergedProps.itemWidthModifier);
    const SPACER = (VISIBLE_WIDTH - ITEM_WIDTH) / 2;
    const ITEM_SPACING = 0;

    // Add spacers so first and last can center
    const listData = [{ id: -1, title: "left-spacer" }, ...mergedProps.data, { id: -1, title: "right-spacer" }] as any[];
    const scrollX = useRef(new Animated.Value(0)).current;
    const ref = useRef<FlatList<any> | null>(null);

    return (
        <View>
            <Animated.FlatList<Book>
                ref={ref}
                data={listData}
                keyExtractor={(item) => item.title + item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_SPACING}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={{ alignItems: "center" }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    // show spacers as empty
                    if (item.id === -1) {
                        return <View style={{ width: SPACER }} />;
                    }

                    const inputRange = [
                        (index - 2) * (ITEM_WIDTH + ITEM_SPACING),
                        (index - 1) * (ITEM_WIDTH + ITEM_SPACING),
                        index * (ITEM_WIDTH + ITEM_SPACING),
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.9, 1, 0.9],
                        extrapolate: "clamp",
                    });

                    const translateY = scrollX.interpolate({
                        inputRange,
                        outputRange: [12, 0, 12],
                        extrapolate: "clamp",
                    });

                    return (
                        <Animated.View
                            style={[
                                styles.animatedItem,
                                {
                                    width: ITEM_WIDTH,
                                    transform: [{ scale }, { translateY }],
                                },
                            ]}
                        >
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => props.onPress && props.onPress(item)}
                                accessibilityLabel={`Open ${item.title}`}
                            >
                                <Image
                                    source={parseSource(`http://192.168.1.100:5000/Get/Book/${item.id}/1`)}
                                    style={[
                                        styles.animatedCover,
                                        { 
                                            width: mergedProps.coverWidth,
                                            height: mergedProps.coverHeight 
                                        },
                                    ]}
                                />
                            </TouchableOpacity>
                            <AppText numberOfLines={1} style={styles.animatedTitle}>
                                {item.title}
                            </AppText>
                        </Animated.View>
                    );
                }}
                ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    animatedItem: {
        alignItems: "center",
    },
    animatedCover: {
        borderRadius: 10,
        backgroundColor: "#ddd",
    },
    animatedTitle: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },
});
