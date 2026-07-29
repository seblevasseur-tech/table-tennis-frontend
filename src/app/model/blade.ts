export interface Blade {
    id: number;
    name: string;
    brand: string;
    avatar: string | null;
    information: string | null;
}

export interface CreateBladeCommand {
    name: string;
    brand: string;
    avatar: File | null;
    information: string;
}