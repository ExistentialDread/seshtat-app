import { Requirement } from './requirement';

export interface Condition {
  id?: number;
  title?: string;
  icon?: string;
  color?: string;
  selected?: boolean;
  grading: { bad: Requirement[]; meh: Requirement[]; good: Requirement[]; great: Requirement[] };
}
