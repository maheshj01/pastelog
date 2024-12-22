import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
// src/models/Log.ts
export enum LogType {
    TEXT = 'text',
    CODE = 'code',
}

export interface ILog {
    expiryDate: string | null;
    data: string;
    createdDate: string;
    lastUpdatedAt: string;
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
    expiryDate: string | null;
    data: string;
    title?: string | '';
    createdDate: string;
    lastUpdatedAt: string;
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
        createdDate = new Date().toUTCString(),
        lastUpdatedAt,
        type,
        isMarkDown,
        title = '',
        summary = '',
        userId = null,
        isPublic = false,
        isExpired = false,
        id
    }: {
        expiryDate?: string | null,
        data: string,
        createdDate?: string,
        lastUpdatedAt?: string,
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
        this.lastUpdatedAt = lastUpdatedAt ? lastUpdatedAt : createdDate;
        this.data = data;
        this.title = title;
        this.isExpired = isExpired;
        this.createdDate = createdDate;
        this.type = type;
        this.summary = summary;
        this.userId = userId;
        this.isPublic = isPublic;
        this.isMarkDown = isMarkDown;
        this.id = id;
    }

    static fromFirestore(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): Log {
        const data = doc.data();
        console.log("firestore", data);
        return new Log({
            expiryDate: data.expiryDate ? (data.expiryDate.toDate ? data.expiryDate.toDate().toUTCString() : data.expiryDate) : null,
            lastUpdatedAt: data.lastUpdatedAt ?? data.createdDate,
            data: data.data,
            createdDate: data.createdDate ? (data.createdDate.toDate ? data.createdDate.toDate().toUTCString() : data.createdDate) : '',
            type: data.type as LogType,
            isMarkDown: data.isMarkDown,
            title: data.title ? data.title : '',
            summary: data.summary,
            userId: data.userId,
            isPublic: data.isPublic,
            isExpired: data.isExpired,
            id: data.id ? data.id : doc.id
        });
    }

    toFirestore(): any {
        const doc: any = {
            expiryDate: this.expiryDate ? this.expiryDate : null,
            lastUpdatedAt: new Date().toUTCString(),
            data: this.data,
            createdDate: this.createdDate,
            title: this.title ? this.title : '',
            type: this.type,
            summary: this.summary,
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

    toJson(): any {
        return {
            expiryDate: this.expiryDate ? this.expiryDate : null,
            lastUpdatedAt: this.lastUpdatedAt,
            data: this.data,
            createdDate: this.createdDate,
            title: this.title ? this.title : '',
            type: this.type,
            summary: this.summary,
            userId: this.userId,
            isPublic: this.isPublic,
            isMarkDown: this.isMarkDown,
            isExpired: this.isExpired,
            id: this.id
        };
    }
}
export default Log;