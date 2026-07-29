export interface Player {
    id: number;
    name: string;
    forname: string;
    avatar: string | null;
    handedness: Handedness;
    blade: BladeSummary;
    forehandRubber: RubberSummary;
    backhandRubber: RubberSummary;
}

export interface CreatePlayerCommand {
    name: string;
    forname: string;
    rating: number;
    avatar: File | null;
    handedness: Handedness | null;
    bladeId: number | null;
    forehandRubberId: number | null;
    backhandRubberId: number | null;
}

export type Handedness = 'RIGHT' | 'LEFT';

export interface BladeSummary { id: number; name: string; brand: string; }
export interface RubberSummary { id: number; name: string; brand: string; }
