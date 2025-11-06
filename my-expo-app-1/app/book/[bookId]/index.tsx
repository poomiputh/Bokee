import AppButton from "@/components/inputs/app-button";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import AppText from "@/components/texts/app-text";
import { Book } from "@/types/Book";
import { parseSource } from "@/utils/imageUtils";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

export default function Index() {
    const { bookId } = useLocalSearchParams<{ bookId: string }>();

    const router = useRouter();

    const { isPending, error, data, refetch } = useQuery<Book>({
        queryKey: ['book'],
        queryFn: () =>
            fetch(`http://192.168.1.100:5000/Get/Book/${bookId}`).then(res => res.json()),
    });

    const goToPage = (page: number) => {
        router.push(`/book/${bookId}/${page}`)
    };

    return (
        <Container>
            {/* Top Row: Cover + Read Button */}
            <Row>
                <Col span={6}>
                    <Image
                        style={{
                            height: 250,
                            backgroundColor: "grey",
                            borderRadius: 10,
                        }}
                        source={parseSource(`http://192.168.1.100:5000/Get/Book/${bookId}/1`)}
                    />
                </Col>
                <Col span={6}>
                    <AppText style={{marginBottom: 15}}>
                        {data?.title ?? ""}
                    </AppText>
                    <AppButton title="Read" onPress={() => { goToPage(1); }} />
                </Col>
            </Row>

            {/* Grid of pages using FlatList */}
            <Row>
                <Col span={12}>
                    <FlatList
                        data={Array.from({ length: data?.totalPages ?? 0 })}
                        keyExtractor={(_, index) => index.toString()}
                        numColumns={2}
                        renderItem={({ index }) => (
                            <View style={{ flex: 1, padding: 5 }}>
                                <TouchableOpacity
                                    onPress={() => { goToPage(index + 1); }}
                                >
                                    <Image
                                        style={{
                                            height: 250,
                                            backgroundColor: "grey",
                                            borderRadius: 10,
                                        }}
                                        source={parseSource(`http://192.168.1.100:5000/Get/Book/${bookId}/${index + 1}`)}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </Col>
            </Row>
        </Container>
    );
}