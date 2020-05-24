import { Activity } from './activity';

export interface Record {
    readonly id?: number;
    date?: string;
    value?: number;
    activityId: number;
    activity?: Activity;
}
