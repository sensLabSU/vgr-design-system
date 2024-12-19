import {Component} from "vue";

export type Align = 'default' | 'center' | 'left' | 'start' | 'right' | 'end';

export interface Graph {
    id: string;
    type: string;
    paths: Component;
    //getPaths: () => Component;
    [others: string]: any;
};

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