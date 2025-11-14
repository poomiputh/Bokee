import { User } from "./User";

export type LoginUserResponse = {
    user: User;
    token: string;
};