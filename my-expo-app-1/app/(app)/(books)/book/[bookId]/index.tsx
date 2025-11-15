import { bookApi } from "@/api/book-api";
import AppButton from "@/components/inputs/app-button";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import Separator from "@/components/layouts/separator";
import AppText from "@/components/texts/app-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Book } from "@/types/Book";
import { parseSource } from "@/utils/imageUtils";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Index() {
    const { bookId } = useLocalSearchParams<{ bookId: string }>();
    const { theme } = useAppTheme();

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
                        <Col span={4}>
                            <Image
                                style={{
                                    flex: 1,
                                    aspectRatio: 2 / 3,
                                    backgroundColor: "grey",
                                    borderRadius: 10,
                                }}
                                source={parseSource(`${apiUrl}/api/Book/GetPage/${bookId}/1`)}
                            />
                        </Col>
                        <Col span={8}>
                            <View style={{ flex: 1, justifyContent: "space-between" }}>
                                <View>
                                    <AppText style={{ marginBottom: 15 }}>
                                        {data?.title ?? ""}
                                    </AppText>
                                    <AppText style={{ marginBottom: 15 }}>
                                        Total pages: {data?.totalPages ?? ""}
                                    </AppText>
                                </View>

                                <View style={{ flexDirection: "row", padding: 0, margin: 0, gap: 10 }}>
                                    <AppButton
                                        title=""
                                        leftIcon={<FontAwesome name="bookmark" size={24} color={theme.colors.primaryContrastTex} />}
                                        style={[styles.button, { aspectRatio: 1 }]}
                                        onPress={() => goToPage(1)}
                                    />
                                    <AppButton
                                        title="Read"
                                        leftIcon={<FontAwesome5 name="readme" size={24} color={theme.colors.primaryContrastTex} />}
                                        leftIconMargin={5}
                                        style={[styles.button, { flex: 1 }]}
                                        onPress={() => goToPage(1)}
                                    />
                                </View>
                            </View>
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

const styles = StyleSheet.create({
    button: {
        paddingVertical: 0,
        height: 40
    }
});