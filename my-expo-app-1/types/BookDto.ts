export type BookDto = {
    id: number;
    title: string;
    storageGuid?: string;
    description?: string;
    totalPages: number;
    currentPage?: number;
    savedId?: number;
    createdDate: Date;
    modifiedDate: Date;
};