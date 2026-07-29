export interface Rubber {
    id: number;
    name: string;
    brand: string;
    avatar: File;
}

export interface CreateRubberCommand {
    name: string;
    brand: string;
    avatar: File;
}