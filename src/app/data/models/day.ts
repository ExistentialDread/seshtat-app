import { Moment } from 'moment';
import { Record } from './record';
import { Condition } from './condition';

export interface Day {
    id: number;
    date: Moment;
    rating?: string;
    records?: Record[];
    conditionId?: number;
    condition?: Condition;
}
