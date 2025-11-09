import { Book } from "@/types/Book";
import { Pagination } from "@/types/Pagination";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const bookApi = {
  fetchBooks: async (page?: number, pageSize?: number): Promise<Pagination<Book>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (pageSize) params.append('pageSize', String(pageSize));

    console.log(params.toString());

    if (!page || !pageSize) pageSize = 6;
    const res = await fetch(`${apiUrl}/Get/Book/AllInfo?${params.toString()}`);
    return res.json();
  },
  fetchBook: async (bookId: number): Promise<Book> => {
    return fetch(`${apiUrl}/Get/Book/${bookId}`).then(res => res.json())
  }
};