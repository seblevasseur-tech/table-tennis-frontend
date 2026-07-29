export interface Blade {
    id: number;
    name: string;
    brand: string;
    avatar: File;
}

export interface CreateBladeCommand {
    name: string;
    brand: string;
    avatar: File;
}