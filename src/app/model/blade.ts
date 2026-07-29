export interface Blade {
    id: number;
    name: string;
    brand: string;
    avatar: string | null;
}

export interface CreateBladeCommand {
    name: string;
    brand: string;
    avatar: File;
}