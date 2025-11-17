import { bookApi } from "@/api/book-api";
import BookCover from "@/components/book-cover";
import AppButton from "@/components/inputs/app-button";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import AppText from "@/components/texts/app-text";
import { BookDto } from "@/types/BookDto";
import { PaginationDto } from "@/types/PaginationDto";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Fragment, useDeferredValue, useRef, useState } from "react";
import { ActivityIndicator, PanResponder, ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const deferredCurrentPage = useDeferredValue(currentPage);

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

    const { isPending, data } = useQuery<PaginationDto<BookDto>>({
        queryKey: ['GetBooks', deferredCurrentPage, 12],
        queryFn: () =>
            bookApi.fetchBooks({
                page: deferredCurrentPage,
                pageSize: 12,
            }),
        placeholderData: keepPreviousData,
    });

    // Functions
    const next = () => {
        setCurrentPage(prev => prev + 1);
    };

    const prev = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToBook = (bookId: number) => {
        router.navigate(`/book/${bookId}`);
    };

    const navigator = (
        <Fragment>
            <AppButton
                title="<"
                fitContent
                onPress={prev}
                style={styles.navigationButton}
            />
            <AppButton
                title="1"
                onPress={() => { setCurrentPage(1); }}
                style={styles.navigationButton}
            />
            <AppText style={{ fontSize: 25 }}>
                ...
            </AppText>
            <AppButton
                title={deferredCurrentPage.toString()}
                style={styles.navigationButton}
                disabled
            />
            <AppText style={{ fontSize: 25 }}>
                ...
            </AppText>
            <AppButton
                title={(data?.lastPage ?? 1).toString()}
                fitContent
                onPress={() => { setCurrentPage(data?.lastPage ?? 1); }}
                style={styles.navigationButton}
            />
            <AppButton
                title=">"
                fitContent
                onPress={next}
                style={styles.navigationButton}
            />
        </Fragment>
    );

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
                            {navigator}
                        </View>
                    </Col>
                </Row>

                {/* Content */}
                <View {...panResponder.panHandlers} style={{ flex: 1, justifyContent: "space-between" }}>
                    {/* Book covers */}
                    <Row style={{ flex: 1, marginBottom: 15 }}>
                        {isPending ?
                            <Col span={12}>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <ActivityIndicator size="large" />
                                </View>
                            </Col>
                            :
                            data!.data.map(book => (
                                <Col key={book.id} span={6}>
                                    <BookCover height={240} onPress={() => goToBook(book.id)} book={book} />
                                </Col>
                            ))
                        }
                    </Row>

                    {/* Pagination actions */}
                    <Row style={{ gap: 5, justifyContent: "center", marginBottom: 15 }}>
                        {navigator}
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
        width: 40,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: "50%"
    }
});