import { bookApi } from "@/api/book-api";
import BookCover from "@/components/book-cover";
import AppButton from "@/components/inputs/app-button";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import AppText from "@/components/texts/app-text";
import { Book } from "@/types/Book";
import { Pagination } from "@/types/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, PanResponder, ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > 50) prev();
                else if (gestureState.dx < -50) next();
            },
        })
    ).current;
    const { isPending, error, data, refetch } = useQuery<Pagination<Book>>({
        queryKey: ['booksInfo', currentPage, 12],
        queryFn: () =>
            bookApi.fetchBooks(currentPage, 12),
    });

    const next = () => {
        setCurrentPage(prev => prev + 1);
    };

    const prev = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToBook = (bookId: number) => {
        router.navigate(`/book/${bookId}`);
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <Container style={{ flex: 1, paddingVertical: 10 }}>
                {/* Header */}
                <Row>
                    <Col span={12}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                gap: 5
                            }}
                        >
                            <AppButton
                                title="1"
                                onPress={() => { setCurrentPage(1); }}
                                style={styles.navigationButton}
                            ></AppButton>
                            <AppButton
                                title="<"
                                fitContent
                                onPress={prev}
                                style={styles.navigationButton}
                            ></AppButton>
                            <AppButton
                                title=">"
                                fitContent
                                onPress={next}
                                style={styles.navigationButton}
                            ></AppButton>
                            <AppButton
                                title={(data?.lastPage ?? 1).toString()}
                                fitContent
                                onPress={() => { setCurrentPage(data?.lastPage ?? 1); }}
                                style={styles.navigationButton}
                            ></AppButton>
                        </View>
                    </Col>
                </Row>

                {/* Content */}
                <View {...panResponder.panHandlers} style={{ flex: 1, justifyContent: "space-between" }}>
                    {/* Book covers */}
                    <Row>
                        {isPending && <ActivityIndicator />}
                        {error && <AppText>Error: {String(error)}</AppText>}
                        {data &&
                            data.data.map(book => (
                                <Col key={book.id} span={6}>
                                    <BookCover height={240} onPress={() => goToBook(book.id)} book={book} />
                                </Col>
                            ))}
                    </Row>

                    {/* Pagination actions */}
                    <Row style={{ gap: 5, justifyContent: "center", marginBottom: 15 }}>
                        <AppButton
                            title="1"
                            fitContent
                            onPress={() => { setCurrentPage(1); }}
                            style={styles.navigationButton}
                        ></AppButton>
                        <AppButton
                            title="<"
                            fitContent
                            onPress={prev}
                            style={styles.navigationButton}
                        ></AppButton>
                        <AppButton
                            title=">"
                            fitContent
                            onPress={next}
                            style={styles.navigationButton}
                        ></AppButton>
                        <AppButton
                            title={(data?.lastPage ?? 1).toString()}
                            fitContent
                            onPress={() => { setCurrentPage(data?.lastPage ?? 1); }}
                            style={styles.navigationButton}
                        ></AppButton>
                    </Row>
                </View>
            </Container>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderRadius: 10,
        height: 40,
        borderWidth: 1,
        padding: 10,
    },
    navigationButton: {
        paddingVertical: 10,
        paddingHorizontal: 17,
    }
});