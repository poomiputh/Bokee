import { BookDto } from "@/types/BookDto";
import { parseSource } from "@/utils/imageUtils";
import { DimensionValue, Image, Text, TouchableOpacity, View } from "react-native";

type BookCoverProps = {
    width?: DimensionValue;
    height?: DimensionValue;
    onPress?: () => void;
    book: BookDto;
}

export default function BookCover(props: BookCoverProps) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => { props.onPress && props.onPress() }}
            accessibilityLabel={`Open ${props.book.title}`}
        >
            <View
                style={{
                    backgroundColor: "transparent",
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 6, // Android shadow
                    overflow: "hidden"
                }}
            >
                <Image
                    style={{
                        backgroundColor: "grey",
                        borderRadius: 10,
                        width: props.width ?? "100%",
                        height: props.height ?? "100%",
                    }}
                    source={parseSource(`${apiUrl}/api/Book/GetPage/${props.book.id}/1`)}
                />

                {!props.book.currentPage &&
                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            height: "20%",
                            // transform: "rotate(-45deg)",
                            backgroundColor: "rgba(255, 166, 0, 1)", // semi-transparent red
                            paddingVertical: 6,
                            paddingHorizontal: 8,
                        }}
                    ></View>
                }

                <View
                    style={{
                        position: "absolute",
                        bottom: "8%",
                        width: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)", // semi-transparent red
                        paddingVertical: 6,
                        paddingHorizontal: 8,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 14,
                            textAlign: "center",
                        }}
                    >
                        {props.book.title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}