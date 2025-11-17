import { bookApi } from "@/api/book-api";
import BookCarousel from "@/components/book-carousel";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import Separator from "@/components/layouts/separator";
import AppText from "@/components/texts/app-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { BookDto } from "@/types/BookDto";
import { FilterBooksDto } from "@/types/FilterBooksDto";
import { PaginationDto } from "@/types/PaginationDto";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Fragment } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const recentFilter: FilterBooksDto = {
    page: 1,
    pageSize: 6,
  }

  const randomFilter: FilterBooksDto = {
    page: 1,
    pageSize: 6,
    random: true
  }

  const recentBooks = useQuery<PaginationDto<BookDto>>({
    queryKey: ['GetBooks', recentFilter.page, recentFilter.pageSize],
    queryFn: () =>
      bookApi.fetchBooks(recentFilter)
  });

  const randomBooks = useQuery<PaginationDto<BookDto>>({
    queryKey: ['GetBooks', "Random", randomFilter.random],
    queryFn: () =>
      bookApi.fetchBooks(randomFilter),
    gcTime: 0
  });

  // Sub-components
  const feed = (feedTitle: string, books: BookDto[], isPending: boolean) => {
    return (
      <Fragment>
        <Row style={{ justifyContent: "space-between" }}>
          <Col span={'auto'}>
            <AppText
              leftIcon={<AntDesign name="caret-right" size={24} color={theme.colors.text} />}
              leftIconMargin={10}
              style={[styles.titleHeader]}
            >
              {feedTitle}
            </AppText>
          </Col>
          <Col span={'auto'} style={{ justifyContent: "center" }}>
            <AppText
              onPress={() => router.navigate("/(app)/(tabs)/library")}
            >
              See more
            </AppText>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {isPending ?
              <ActivityIndicator size="large" />
              :
              <BookCarousel
                data={books}
                coverWidth={108}
                coverHeight={162}
                itemWidthModifier={0.35}
                onPress={(book) => { goToBook(book.id) }}
                disableCenterFocus
              />
            }
          </Col>
        </Row>
        <Separator style={{ marginVertical: 20 }} />
      </Fragment>
    );
  };

  // Functions
  const refetchAll = () => {
    recentBooks.refetch();
    randomBooks.refetch();
  };

  const goToBook = (bookId: number) => {
    router.push(`/book/${bookId}`);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refetchAll} />
      }
    >
      <Container style={{ paddingVertical: 20 }}>
        {/* Continue reading */}
        {feed("Continue reading", recentBooks.data?.data ?? [], recentBooks.isPending)}

        {/* Recently added */}
        {feed("Recently added", recentBooks.data?.data ?? [], recentBooks.isPending)}

        {/* Feeling lucky? */}
        {feed("Feeling lucky?", randomBooks.data?.data ?? [], recentBooks.isPending)}
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleHeader: {
    fontSize: 20
  }
});
