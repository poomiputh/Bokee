import { bookApi } from "@/api/book-api";
import BookCarousel from "@/components/book-carousel";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import { Book } from "@/types/Book";
import { Pagination } from "@/types/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";

export default function Index() {
  const router = useRouter();

  const { isPending, error, data, refetch } = useQuery<Pagination<Book>>({
    queryKey: ['booksInfo'],
    queryFn: () =>
      bookApi.fetchBooks(1, 6)
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const goToBook = (bookId: number) => {
    router.push(`/book/${bookId}`);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Container style={{ paddingVertical: 20 }}>
        <Row>
          <Col span={12}>
            <BookCarousel
              data={data?.data ?? []}
              coverWidth={120}
              coverHeight={180}
              itemWidthModifier={0.35}
              onPress={(book) => { goToBook(book.id) }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <BookCarousel
              data={data?.data ?? []}
              coverWidth={120}
              coverHeight={180}
              itemWidthModifier={0.35}
              onPress={(book) => { goToBook(book.id) }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <BookCarousel
              data={data?.data ?? []}
              coverWidth={120}
              coverHeight={180}
              itemWidthModifier={0.35}
              onPress={(book) => { goToBook(book.id) }}
            />
          </Col>
        </Row>
      </Container>
    </ScrollView>
  );
}
