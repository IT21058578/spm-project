import { UserDto } from "./user.dto";

export class LoginDto {
    user: UserDto;
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
}