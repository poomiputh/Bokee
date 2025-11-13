import { Book } from "@/types/Book";
import { Pagination } from "@/types/Pagination";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const bookApi = {
  fetchBooks: async (page?: number, pageSize?: number): Promise<Pagination<Book>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (pageSize) params.append('pageSize', String(pageSize));

    if (!page || !pageSize) pageSize = 6;

    const url = `${apiUrl}/api/Book/GetBooks?${params.toString()}`;
    console.log("Fetching from :", url);
    return fetch(url).then(res => res.json());
  },
  fetchBook: async (bookId: number): Promise<Book> => {
    const url = `${apiUrl}/api/Book/GetBook/${bookId}`;
    console.log("Fetching from :", url);
    return fetch(url).then(res => res.json());
  }
};