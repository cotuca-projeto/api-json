export interface IUser {
    id: number;
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    photo?: string | null;
    token?: string;
}

export interface ITask {
    title: string;
    description: string;
    user: number;
}