import type { Blade } from './blade';
import type { Rubber } from './rubber';

export interface Player {
    id: number;
    name: string;
    forname: string;
    avatar: string | null;
    information: string | null;
    countryCode: string;
    handedness: Handedness;
    blade: Blade;
    forehandRubber: Rubber;
    backhandRubber: Rubber;
}

export interface CreatePlayerCommand {
    name: string;
    forname: string;
    avatar: File | null;
    information: string;
    countryCode: string | null;
    handedness: Handedness | null;
    bladeId: number | null;
    forehandRubberId: number | null;
    backhandRubberId: number | null;
}

export type Handedness = 'RIGHT' | 'LEFT';

export interface BladeSummary { id: number; name: string; brand: string; }
export interface RubberSummary { id: number; name: string; brand: string; }
