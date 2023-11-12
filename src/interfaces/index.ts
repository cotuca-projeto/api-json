export interface IUser {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    photo?: string | null;
}

export interface ITask {
    title: string;
    description: string;
    user: number;
}