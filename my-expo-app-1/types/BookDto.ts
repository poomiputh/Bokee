export type BookDto = {
    id: number;
    title: string;
    storageGuid?: string;
    description?: string;
    totalPages: number;
    unread: boolean;
    createdDate: Date;
    modifiedDate: Date;
};