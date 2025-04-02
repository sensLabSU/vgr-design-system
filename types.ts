import type {Component} from "vue";

export type Align = 'default' | 'center' | 'left' | 'start' | 'right' | 'end';

export interface Graph {
    id: string;
    type: string;
    paths: Component;
    [others: string]: any;
};

export type ColorName = 'healthcare'|'culture'|'education'|'base'|'neutral'|'error'|'purple'|'brown'|'cyan'|'green'|'lime'|'orange'|'pink'|'yellow'|'blue'|'white'|'black';

export type SleepDataPoint = {
    level: 'wake'|'rem'|'light'|'deep';
    seconds: number;
    dateTime: string;
};

export type SleepData = {
    start: string;
    end: string;
    data: SleepDataPoint[];
    shortData?: SleepDataPoint[];
};