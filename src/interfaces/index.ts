export interface IUser {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_image?: string | null;
}

export interface ITask {
    title: string;
    description: string;
    user_id: number;
}