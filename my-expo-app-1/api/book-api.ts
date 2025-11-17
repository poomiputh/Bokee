import { BookDto } from "@/types/BookDto";
import { FilterBooksDto } from "@/types/FilterBooksDto";
import { PaginationDto } from "@/types/PaginationDto";
import { toSearchParams } from "@/utils/urlUtils";
import { axiosClient } from "./axios-client/axios-client";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const bookApi = {

  fetchBooks: async (filter: FilterBooksDto): Promise<PaginationDto<BookDto>> => {
    const url = `${apiUrl}/api/Book/GetBooks?${toSearchParams(filter)}`;
    const result = await axiosClient.get<PaginationDto<BookDto>>(url);
    return result.data;
  },

  fetchBook: async (bookId: number): Promise<BookDto> => {
    const url = `${apiUrl}/api/Book/GetBook/${bookId}`;
    const result = await axiosClient.get<BookDto>(url);
    return result.data;
  }
  
};