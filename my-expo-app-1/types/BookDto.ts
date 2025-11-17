export type BookDto = {
    id: number;
    title: string;
    storageGuid?: string;
    description?: string;
    totalPages: number;
    currentPage?: number;
    isSaved: boolean;
    createdDate: Date;
    modifiedDate: Date;
};