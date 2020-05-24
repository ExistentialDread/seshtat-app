import { Activity } from './activity';

export interface SimpleCondition {
    activityId: number;
    maxValue?: number;
    minValue?: number;
    activity?: Activity;
}

export type Requirement = SimpleCondition[];
