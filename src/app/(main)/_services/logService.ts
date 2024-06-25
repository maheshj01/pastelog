// src/services/LogService.ts

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { Log } from '../_models/Log';

class LogService {
    private logCollection = collection(db, `${process.env.NEXT_PUBLIC_FIREBASE_COLLECTION}`);

    async fetchLogs(): Promise<Log[]> {
        const querySnapshot = await getDocs(this.logCollection);
        const logs: Log[] = [];
        querySnapshot.forEach((doc) => {
            const log = Log.fromFirestore(doc);
            if (!log.isExpired) {
                logs.push(log);
            }
        });

        // Save fetched logs to localStorage
        this.saveLogsToLocal(logs);
        return logs;
    }

    async fetchLogById(id: string): Promise<Log | null> {
        const docRef = doc(this.logCollection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const log = Log.fromFirestore(docSnap);
            this.saveLogToLocal(log);
            return log;
        } else {
            return null;
        }
    }

    async publishLog(log: Log): Promise<string> {
        try {
            const docRef = await addDoc(this.logCollection, log.toFirestore());
            if (docRef.id) {
                await this.saveLogToLocal({
                    ...log, id: docRef.id,
                    toFirestore: function () {
                        throw new Error('Function not implemented.');
                    }
                });
                return docRef.id!
            }
            return await this.fetchLogFromLocalById(docRef.id) ? docRef.id : '';
        } catch (e) {
            return '';
        }
    }

    async publishLogWithId(log: Log, id: string): Promise<string> {
        const docRef = doc(this.logCollection, id);
        await setDoc(docRef, log.toFirestore());
        await this.saveLogToLocal({
            ...log, id: docRef.id,
            toFirestore: function () {
                throw new Error('Function not implemented.');
            }
        });
        return docRef.id;
    }

    async updateLog(id: string, log: Log): Promise<void> {
        const docRef = doc(this.logCollection, id);
        await updateDoc(docRef, log.toFirestore());
        await this.saveLogToLocal(log);
    }

    async markExpiredById(id: string): Promise<void> {
        const docRef = doc(this.logCollection, id);
        await updateDoc(docRef, { isExpired: true });
        await this.deleteLogFromLocal(id);
    }

    async deleteLogById(id: string): Promise<void> {
        const docRef = doc(this.logCollection, id);
        await deleteDoc(docRef);
        await this.deleteLogFromLocal(id);
    }

    async deleteExpiredLogs(): Promise<void> {
        const querySnapshot = await getDocs(this.logCollection);
        const updatePromises: Promise<void>[] = [];
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        querySnapshot.forEach((doc) => {
            const log = Log.fromFirestore(doc);
            if (log.expiryDate && log.expiryDate < today) {
                updatePromises.push(
                    updateDoc(doc.ref, { isExpired: true })
                        .catch((error) => console.error(`Error updating log ${log.id}:`, error))
                );
            }
        });

        try {
            await Promise.all(updatePromises);
        } catch (error) {
        }
    }

    async isLogPresentLocally(id: string): Promise<boolean> {
        const logs = await this.fetchLogsFromLocal();
        return logs.some(log => log.id === id);
    }

    // Local Storage Methods
    private saveLogsToLocal(logs: Log[]): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('logs', JSON.stringify(logs));
        }
    }

    async fetchLogsFromLocal(): Promise<Log[]> {
        if (typeof window !== 'undefined') {
            const logs = localStorage.getItem('logs');
            // filter expired
            if (logs) {
                const parsedLogs = JSON.parse(logs) as Log[];
                // Convert createdDate strings back to Date objects
                parsedLogs.forEach(log => {
                    log.createdDate = new Date(log.createdDate);
                    if (log.expiryDate) {
                        log.expiryDate = new Date(log.expiryDate);
                    }
                });

                const filtered = parsedLogs.filter(log => !log.isExpired);

                // sort by created date in reverse order
                return filtered.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
            }
            return [];
        }
        return [];
    }

    async saveLogToLocal(log: Log): Promise<void> {
        const logs = await this.fetchLogsFromLocal();
        const existingIndex = logs.findIndex(existingLog => existingLog.id === log.id);
        if (existingIndex !== -1) {
            logs[existingIndex] = log;
        } else {
            logs.push(log);
        }
        this.saveLogsToLocal(logs);
    }

    async fetchLogFromLocalById(id: string): Promise<Log | null> {
        const logs = await this.fetchLogsFromLocal();
        const log = logs.find(log => log.id === id);
        return log || null;
    }

    async deleteLogFromLocal(id: string): Promise<void> {
        const logs = await this.fetchLogsFromLocal();
        const updatedLogs = logs.filter(log => log.id !== id);
        this.saveLogsToLocal(updatedLogs);
    }
}

export default LogService;
