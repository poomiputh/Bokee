import { SetBookProgressDto } from "@/types/SetBookProgressDto";
import { axiosClient } from "./axios-client/axios-client";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const userApi = {

    setBookProgress: async (progress: SetBookProgressDto) => {
        const url = `${apiUrl}/api/User/SetBookProgress`;
        const result = await axiosClient.post(url, progress);
        return result.data;
    }

};