export interface Player {
    id: number;
    name: string;
    forname: string;
    rating: number;
    avatar: File;
}

export interface CreatePlayerCommand {
    name: string;
    forname: string;
    rating: number;
    avatar: File;
}