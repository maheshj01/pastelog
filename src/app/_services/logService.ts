// src/services/LogService.ts
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Log } from '../_models/Log';

class LogService {
    private logCollection = collection(db, 'logs_dev');
    async fetchLogs(): Promise<Log[]> {
        const querySnapshot = await getDocs(this.logCollection);
        return querySnapshot.docs.map((doc: any) => Log.fromFirestore(doc));
    }

    async fetchLogById(id: string): Promise<Log | null> {
        const docRef = doc(this.logCollection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return Log.fromFirestore(docSnap);
        } else {
            return null;
        }
    }

    async publishLog(log: Log): Promise<void> {
        try {
            const docRef = await addDoc(this.logCollection, log.toFirestore());
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async updateLog(id: string, log: Log): Promise<void> {
        const docRef = doc(this.logCollection, id);
        await updateDoc(docRef, log.toFirestore());
    }
}

export default LogService;