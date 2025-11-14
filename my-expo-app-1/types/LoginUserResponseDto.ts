import { User } from "./User";

export type LoginUserResponseDto = {
    user: User;
    token: string;
};