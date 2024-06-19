import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

// src/models/Log.ts
export enum LogType {
    TEXT = 'text',
    CODE = 'code',
}

export interface ILog {
    expiryDate: Date | null;
    data: string;
    createdDate: Date;
    title?: string | '';
    type: LogType;
    isMarkDown: boolean;
    id?: string;
    isExpired?: boolean | false;
}

export class Log implements ILog {
    expiryDate: Date | null;
    data: string;
    title?: string | '';
    createdDate: Date;
    type: LogType;
    isMarkDown: boolean;
    isExpired?: boolean | false;
    id?: string | undefined;

    constructor(
        expiryDate: Date | null,
        data: string,
        createdDate: Date,
        type: LogType,
        isMarkDown: boolean,
        title?: string | '',
        isExpired?: boolean | false,
        id?: string
    ) {
        this.expiryDate = expiryDate;
        this.data = data;
        this.title = title;
        this.isExpired = isExpired;
        this.createdDate = new Date(createdDate);
        this.type = type;
        this.isMarkDown = isMarkDown;
        this.id = id;
    }

    static fromFirestore(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): Log {
        const data = doc.data();
        return new Log(
            data.expiryDate ? new Date(data.expiryDate) : null,
            data.data,
            new Date(data.createdDate),
            data.type as LogType,
            data.isMarkDown,
            data.title ? data.title : '',
            data.isExpired,
            data.id ? data.id : doc.id
        );
    }

    toFirestore(): any {
        return {
            expiryDate: this.expiryDate ? this.expiryDate.toISOString() : null,
            data: this.data,
            createdDate: this.createdDate.toISOString(),
            title: this.title ? this.title : '',
            type: this.type,
            isMarkDown: this.isMarkDown,
            isExpired: this.isExpired
        };
    }
}

export default Log;