import { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

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
    summary?: string | '';
    userId?: string | null;
    public?: boolean | false;
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
    summary?: string | '';
    userId?: string | null;
    isPublic?: boolean | false;
    id?: string | undefined;

    constructor({
        expiryDate = null,
        data,
        createdDate = new Date(),
        type,
        isMarkDown,
        title = '',
        summary = '',
        userId = null,
        isPublic = false,
        isExpired = false,
        id
    }: {
        expiryDate?: Date | null,
        data: string,
        createdDate?: Date,
        type: LogType,
        isMarkDown: boolean,
        title?: string,
        summary?: string,
        userId?: string | null,
        isPublic?: boolean,
        isExpired?: boolean,
        id?: string
    }) {
        this.expiryDate = expiryDate;
        this.data = data;
        this.title = title;
        this.isExpired = isExpired;
        this.createdDate = new Date(createdDate);
        this.type = type;
        this.summary = summary;
        this.userId = userId;
        this.isPublic = isPublic;
        this.isMarkDown = isMarkDown;
        this.id = id;
    }

    static fromFirestore(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): Log {
        const data = doc.data();
        return new Log({
            expiryDate: data.expiryDate ? data.expiryDate.toDate : null,
            data: data.data,
            createdDate: data.createdDate ? data.createdDate.toDate : new Date(),
            type: data.type as LogType,
            isMarkDown: data.isMarkDown,
            title: data.title || '',
            summary: data.summary,
            userId: data.userId,
            isPublic: data.isPublic,
            isExpired: data.isExpired,
            id: data.id ? data.id : doc.id
        }
        );
    }

    toFirestore(): any {
        const doc: any = {
            expiryDate: this.expiryDate ? Timestamp.fromDate(this.expiryDate) : null,
            data: this.data,
            createdDate: Timestamp.fromDate(this.createdDate),
            title: this.title || '',
            type: this.type,
            summary: this.summary || '',
            userId: this.userId,
            isPublic: this.isPublic,
            isMarkDown: this.isMarkDown,
            isExpired: this.isExpired,
        };

        if (this.summary === undefined || this.summary === null) {
            doc.summary = '';
        }
        else {
            doc.summary = this.summary;
        }
        return doc;
    }
}
export default Log;