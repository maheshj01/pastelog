// src/services/firebaseService.ts
import { Timestamp, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';

export class UserService {
    private usersCollection = collection(db, `${process.env.NEXT_PUBLIC_USERS_COLLECTION}`);

    // User methods
    async createOrUpdateUser(user: any): Promise<void> {
        if (!user.id) throw new Error('User ID is required');
        const userRef = doc(this.usersCollection, user.id);
        await setDoc(userRef, user, { merge: true });
    }

    async getUserById(userId: string): Promise<any | null> {
        const docRef = doc(this.usersCollection, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
    }

    async updateUserLastLogin(userId: string): Promise<void> {
        const userRef = doc(this.usersCollection, userId);
        await updateDoc(userRef, { lastLoginAt: Timestamp.now() });
    }

    async updateFirstTimeUserLogs(userId: string): Promise<void> {
        const userRef = doc(this.usersCollection, userId);
        await updateDoc(userRef, { firstTimeUserLogUpdated: true });
    }
}