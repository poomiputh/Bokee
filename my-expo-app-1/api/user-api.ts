import { CreateSavedBookDto } from "@/types/CreateSavedBookDto";
import { SetBookProgressDto } from "@/types/SetBookProgressDto";
import { axiosClient } from "./axios-client/axios-client";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const userApi = {

    setBookProgress: async (progressData: SetBookProgressDto) => {
        const url = `${apiUrl}/api/User/SetBookProgress`;
        const result = await axiosClient.post(url, progressData);
        return result.data;
    },

    createSavedBook: async (createData: CreateSavedBookDto) => {
        const url = `${apiUrl}/api/User/CreateSavedBook`;
        const result = await axiosClient.post(url, createData);
        return result.data;
    }

};