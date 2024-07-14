// src/services/firebaseService.ts
import { Timestamp, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { User } from '../_models/User';

export class UserService {
    private usersCollection = collection(db, `${process.env.NEXT_PUBLIC_USERS_COLLECTION}`);

    // User methods
    async createOrUpdateUser(user: User): Promise<void> {
        if (!user.id) throw new Error('User ID is required');
        const userRef = doc(this.usersCollection, user.id);
        await setDoc(userRef, user.toFirestore(), { merge: true });
    }

    async getUserById(userId: string): Promise<User | null> {
        const docRef = doc(this.usersCollection, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return User.fromFirestore(docSnap);
        }
        return null;
    }

    async updateUserLastLogin(userId: string): Promise<void> {
        const userRef = doc(this.usersCollection, userId);
        await updateDoc(userRef, { lastLoginAt: Timestamp.now() });
    }
}