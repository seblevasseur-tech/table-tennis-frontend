export interface Rubber {
    id: number;
    name: string;
    brand: string;
    avatar: string | null;
}

export interface CreateRubberCommand {
    name: string;
    brand: string;
    avatar: File;
}