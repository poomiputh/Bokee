export interface Pagination<T> {
    data: T[];
    currentPage: number;
    lastPage: number;
}   