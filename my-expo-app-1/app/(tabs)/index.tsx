import BookCarousel from "@/components/book-carousel";
import { Book } from "@/types/Book";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();

  const { isPending, error, data, refetch } = useQuery<Book[]>({
    queryKey: ['booksInfo'],
    queryFn: () =>
      fetch(`http://192.168.1.100:5000/Get/Book/AllInfo?page=1&pageSize=6`).then(res => res.json()),
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BookCarousel 
        data={data ?? []}
        coverWidth={180}
        coverHeight={300}
        itemWidthModifier={0.55}
        onPress={(book) => {goToBook(book.id)}}
      />
    </View>
  );
}
