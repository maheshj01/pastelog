// src/services/LogService.ts

import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { Log } from '../_models/Log';

class LogService {
    private logCollection = collection(db, `${process.env.NEXT_PUBLIC_FIREBASE_COLLECTION}`);

    async fetchLogs(): Promise<Log[]> {
        const logsFromLocal = await this.fetchLogsFromLocal();
        if (logsFromLocal.length > 0) {
            return logsFromLocal;
        }

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
                return docRef.id;
            }
            return '';
        } catch (e) {
            return '';
        }
    }

    async updateLog(id: string, log: Log): Promise<void> {
        const docRef = doc(this.logCollection, id);
        await updateDoc(docRef, log.toFirestore());
        await this.saveLogToLocal(log);
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
            console.log('All expired logs have been updated');
        } catch (error) {
            console.error('Error in deleteExpiredLogs:', error);
        }
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
            return logs ? JSON.parse(logs) : [];
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
