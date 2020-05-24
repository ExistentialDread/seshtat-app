
import { G } from '@svgdotjs/svg.js';

export interface Path {
    col: number,
    row: number,
}

export interface Action {
    title: string;
    done: boolean;
}

export interface Step {
    id?: number;
    title: string;
    description: string;
    outcome: string;
    mountainId: number;
    isGod?: boolean,
    isLeaf?: boolean;
    row: number;
    col: number;
    icon: string;
    status: 'INPROGRESS' | 'LOCKED' | 'DONE';
    paths: Path[][];
    actions: Action[];
}
