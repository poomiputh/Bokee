import { UserDto } from "./UserDto";

export type LoginUserResponseDto = {
    user: UserDto;
    token: string;
};