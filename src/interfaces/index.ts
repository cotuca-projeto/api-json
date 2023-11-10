export interface IUser {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_image?: string | null;
}