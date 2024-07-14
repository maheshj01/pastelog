// src/models/User.ts
import { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

export interface IUser {
    id?: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Date;
    lastLoginAt: Date;
}

export class User implements IUser {
    id?: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Date;
    lastLoginAt: Date;

    constructor(
        email: string,
        displayName: string | null,
        photoURL: string | null,
        createdAt: Date,
        lastLoginAt: Date,
        id?: string
    ) {
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this.id = id;
    }

    static fromFirestore(doc: QueryDocumentSnapshot<DocumentData>): User {
        const data = doc.data();
        return new User(
            data.email,
            data.displayName,
            data.photoURL,
            (data.createdAt as Timestamp).toDate(),
            (data.lastLoginAt as Timestamp).toDate(),
            doc.id
        );
    }

    toFirestore(): DocumentData {
        return {
            email: this.email,
            displayName: this.displayName,
            photoURL: this.photoURL,
            createdAt: Timestamp.fromDate(this.createdAt),
            lastLoginAt: Timestamp.fromDate(this.lastLoginAt)
        };
    }
}