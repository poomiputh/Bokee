import { bookApi } from "@/api/book-api";
import AppButton from "@/components/inputs/app-button";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import Separator from "@/components/layouts/separator";
import AppText from "@/components/texts/app-text";
import { Book } from "@/types/Book";
import { parseSource } from "@/utils/imageUtils";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

export default function Index() {
    const { bookId } = useLocalSearchParams<{ bookId: string }>();

    const navigation = useNavigation();
    const router = useRouter();
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const { isPending, data } = useQuery<Book>({
        queryKey: ['book', bookId],
        queryFn: () =>
            bookApi.fetchBook(parseInt(bookId))
    });

    const goToPage = (page: number) => {
        router.push(`/book/${bookId}/${page}`)
    };

    // useEffect(() => {
    //     if (!isPending) {
    //         navigation.setOptions({
    //             title: "My Dynamic Header",
    //         });
    //     }
    // }, [isPending]);

    return (
        <FlatList
            ListHeaderComponent={
                <Container>
                    <Row>
                        <Col span={6}>
                            <Image
                                style={{
                                    height: 250,
                                    backgroundColor: "grey",
                                    borderRadius: 10,
                                }}
                                source={parseSource(`${apiUrl}/api/Book/GetPage/${bookId}/1`)}
                            />
                        </Col>
                        <Col span={6}>
                            <AppText style={{ marginBottom: 15 }}>
                                {data?.title ?? ""}
                            </AppText>
                            <AppText style={{ marginBottom: 15 }}>
                                Total pages: {data?.totalPages ?? ""}
                            </AppText>
                            <AppButton
                                title="Read"
                                style={{}}
                                onPress={() => goToPage(1)}
                            />
                        </Col>
                    </Row>
                    <Separator />
                </Container>
            }
            columnWrapperStyle={{
                padding: 5
            }}
            data={Array.from({ length: data?.totalPages ?? 0 })}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            renderItem={({ index }) => (
                <View style={{ flex: 1, padding: 5 }}>
                    <TouchableOpacity onPress={() => goToPage(index + 1)}>
                        <Image
                            style={{
                                height: 250,
                                backgroundColor: "grey",
                                borderRadius: 10,
                            }}
                            source={parseSource(`${apiUrl}/api/Book/GetPage/${bookId}/${index + 1}`)}
                        />
                    </TouchableOpacity>
                </View>
            )}
            showsVerticalScrollIndicator={false}
        />
    );
}