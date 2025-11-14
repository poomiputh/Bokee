import { Book } from "@/types/Book";
import { FilterBooksDto } from "@/types/FilterBooksDto";
import { Pagination } from "@/types/Pagination";
import { toSearchParams } from "@/utils/urlUtils";
import { axiosClient } from "./axios-client/axios-client";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const bookApi = {

  fetchBooks: async (filter: FilterBooksDto): Promise<Pagination<Book>> => {
    const url = `${apiUrl}/api/Book/GetBooks?${toSearchParams(filter)}`;
    const result = await axiosClient.get<Pagination<Book>>(url);
    return result.data;
  },

  fetchBook: async (bookId: number): Promise<Book> => {
    const url = `${apiUrl}/api/Book/GetBook/${bookId}`;
    const result = await axiosClient.get<Book>(url);
    return result.data;
  }
  
};