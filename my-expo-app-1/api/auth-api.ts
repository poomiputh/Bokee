import { LoginUserDto } from "@/types/LoginUserDto";
import { LoginUserResponseDto } from "@/types/LoginUserResponseDto";
import { axiosClient } from "./axios-client/axios-client";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const authApi = {

    loginUser: async (loginData: LoginUserDto): Promise<LoginUserResponseDto> => {
        const url = `${apiUrl}/api/Account/LoginUser`;
        const result = await axiosClient.post<LoginUserResponseDto>(url, loginData);
        return result.data;
    }

};