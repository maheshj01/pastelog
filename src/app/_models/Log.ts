import { title } from "process";

// src/models/Log.ts
export enum LogType {
    TEXT = 'text',
    CODE = 'code',
}

export interface ILog {
    expiryDate: Date | null;
    data: string;
    createdDate: Date;
    title: string;
    type: LogType;
    isMarkDown: boolean;
}

export class Log implements ILog {
    expiryDate: Date | null;
    data: string;
    title: string;
    createdDate: Date;
    type: LogType;
    isMarkDown: boolean;

    constructor(
        expiryDate: Date | null,
        data: string,
        createdDate: Date,
        title: string,
        type: LogType,
        isMarkDown: boolean
    ) {
        this.expiryDate = expiryDate;
        this.data = data;
        this.title = title;
        this.createdDate = new Date(createdDate);
        this.type = type;
        this.isMarkDown = isMarkDown;
    }

    static fromFirestore(doc: any): Log {
        const data = doc.data();
        return new Log(
            data.expiryDate ? new Date(data.expiryDate) : null,
            data.data,
            new Date(data.createdDate),
            title,
            data.type as LogType,
            data.isMarkDown
        );
    }

    toFirestore(): any {
        return {
            expiryDate: this.expiryDate ? this.expiryDate.toISOString() : null,
            data: this.data,
            createdDate: this.createdDate.toISOString(),
            title: this.title,
            type: this.type,
            isMarkDown: this.isMarkDown
        };
    }
}

export default Log;