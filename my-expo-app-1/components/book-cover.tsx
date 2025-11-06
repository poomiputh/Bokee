import { Book } from "@/types/Book";
import { parseSource } from "@/utils/imageUtils";
import { DimensionValue, Image, Text, TouchableOpacity, View } from "react-native";

type BookCoverProps = {
    width?: DimensionValue;
    height?: DimensionValue;
    onPress?: () => void;
    book: Book;
}

export default function BookCover(props: BookCoverProps) {
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
                }}
            >
                <Image
                    style={{
                        backgroundColor: "grey",
                        borderRadius: 10,
                        width: props.width ?? "100%",
                        height: props.height ?? "100%",
                    }}
                    source={parseSource(`http://192.168.1.100:5000/Get/Book/${props.book.id}/1`)}
                />

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