export interface PaginationDto<T> {
    data: T[];
    currentPage: number;
    lastPage: number;
}   