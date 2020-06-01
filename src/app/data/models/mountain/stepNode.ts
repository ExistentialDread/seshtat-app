
import { G } from '@svgdotjs/svg.js';
import { Step } from './step';

export class StepNode {
    content: G; 
    paths: G[] = [];
    step: Step;

    constructor(step: Step) {
        this.step = step;
    }

    getRow(): number {
        return this.step.row;
    }

    getColumn(): number {
        return this.step.col;
    }

    getXofCol(col: number) {
        return 10 + col * 70;
    }

    getYofRow(row: number) {
        return 10 + row * 110;
    }

    getX(): number {
        return this.getXofCol(this.getColumn());
    }

    getY(): number {
        return this.getYofRow(this.getRow());
    }

    getIcon(): string {
        return this.step.icon;
    }

    isLocked(): boolean {
        return this.step.status == 'LOCKED';
    }

    isDone(): boolean {
        return this.step.status == 'DONE';
    }

    isGod(): boolean {
        return this.step.isGod;
    }

    getAdvancement() {
        if(!this.step.actions || this.step.actions.length == 0) return '0/0';
        console.log(this.step.actions);
        const done = this.step.actions.filter(action => action.done == true).length;
        return done + '/' + this.step.actions.length;
    }
}