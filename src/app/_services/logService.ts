// src/services/logService.ts
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Log } from '../_models/Log';

const logCollection = collection(db, 'logs');

export const fetchLogs = async (): Promise<Log[]> => {
    const querySnapshot = await getDocs(logCollection);
    return querySnapshot.docs.map((doc) => Log.fromFirestore(doc));
};

export const fetchLogById = async (id: string): Promise<Log | null> => {
    const docRef = doc(logCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return Log.fromFirestore(docSnap);
    } else {
        return null;
    }
};

export const createLog = async (log: Log): Promise<void> => {
    await addDoc(logCollection, log.toFirestore());
};

export const updateLog = async (id: string, log: Log): Promise<void> => {
    const docRef = doc(logCollection, id);
    await updateDoc(docRef, log.toFirestore());
};
