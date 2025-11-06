import BookCover from "@/components/book-cover";
import AppButton from "@/components/inputs/app-button";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import AppText from "@/components/texts/app-text";
import { Book } from "@/types/Book";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { PanResponder, ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const next = () => {
        setCurrentPage(prev => prev + 1);
    };

    const prev = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

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

    const { isPending, error, data, refetch } = useQuery<Book[]>({
        queryKey: ['booksInfo'],
        queryFn: () =>
            fetch(`http://192.168.1.100:5000/Get/Book/AllInfo?page=${currentPage}&pageSize=6`).then(res => res.json()),
    });

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    useEffect(() => {
        refetch();
    }, [currentPage]);

    const goToBook = (bookId: number) => {
        router.push(`/book/${bookId}`);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Container style={{ flex: 1, paddingVertical: 10 }}>
                <Row>
                    <Col span={12}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}
                        >
                            <AppText>Page {currentPage}</AppText>
                            <Row style={{ gap: 5 }}>
                                <AppButton
                                    title="<<"
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
                                {/* <AppButton
                                    title=">>"
                                    fitContent
                                    onPress={next}
                                ></AppButton> */}
                            </Row>
                        </View>
                    </Col>
                </Row>
                <View {...panResponder.panHandlers} style={{ flex: 1, justifyContent: "space-between" }}>
                    <Row>
                        {isPending && <AppText>Loading...</AppText>}
                        {error && <AppText>Error: {String(error)}</AppText>}
                        {data &&
                            data.map(book => (
                                <Col key={book.id} span={6}>
                                    <BookCover height={240} onPress={() => goToBook(book.id)} book={book} />
                                </Col>
                            ))}
                    </Row>
                    <Row style={{ gap: 5, justifyContent: "center", marginBottom: 15 }}>
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