import { bookApi } from "@/api/book-api";
import BookCarousel from "@/components/book-carousel";
import { Col, Container, Row } from "@/components/layouts/app-layout";
import AppText from "@/components/texts/app-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Book } from "@/types/Book";
import { Pagination } from "@/types/Pagination";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const { isPending, error, data, refetch } = useQuery<Pagination<Book>>({
    queryKey: ['booksInfo', 1, 6],
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
        {/* Continue reading */}
        <Row>
          <Col span={12}>
            <AppText
              leftIcon={<AntDesign name="caret-right" size={24} color={theme.colors.text} />}
              leftIconMargin={10}
              style={[styles.titleHeader]}
            >
              Continue reading
            </AppText>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <BookCarousel
              data={data?.data ?? []}
              coverWidth={108}
              coverHeight={162}
              itemWidthModifier={0.35}
              onPress={(book) => { goToBook(book.id) }}
              disableCenterFocus
            />
          </Col>
        </Row>

        {/* Recently added */}
        <Row>
          <Col span={12}>
            <AppText
              leftIcon={<MaterialCommunityIcons name="lightning-bolt" size={24} color={theme.colors.text} />}
              leftIconMargin={10}
              style={[styles.titleHeader]}
            >
              Recently added
            </AppText>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <BookCarousel
              data={data?.data ?? []}
              coverWidth={108}
              coverHeight={162}
              itemWidthModifier={0.35}
              onPress={(book) => { goToBook(book.id) }}
              disableCenterFocus
            />
          </Col>
        </Row>

        {/* Feeling lucky? */}
        <Row>
          <Col span={12}>
            <AppText
              leftIcon={<FontAwesome name="random" size={20} color={theme.colors.text} />}
              leftIconMargin={10}
              style={[styles.titleHeader]}
            >
              Feeling lucky?
            </AppText>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <BookCarousel
              data={data?.data ?? []}
              coverWidth={108}
              coverHeight={162}
              itemWidthModifier={0.35}
              onPress={(book) => { goToBook(book.id) }}
              disableCenterFocus
            />
          </Col>
        </Row>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleHeader: {
    fontSize: 20
  }
});
