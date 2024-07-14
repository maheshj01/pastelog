// src/services/LogService.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { Log, LogType } from '../_models/Log';
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
            const local = await this.fetchLogFromLocalById(id);
            log!.summary = local?.summary!;
            return log;
        } else {
            return null;
        }
    }

    async getGuestLogs(): Promise<Log[]> {
        const q = query(this.logCollection, where('userId', '==', null));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => Log.fromFirestore(doc));
    }

    async getLogsByUserId(userId: string): Promise<Log[]> {
        const q = query(this.logCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => Log.fromFirestore(doc));
    }

    async publishLog(log: Log): Promise<string> {
        try {
            const docRef = await addDoc(this.logCollection, log.toFirestore());
            // Todo Save log to local only if userId is null
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
            throw new Error(`Failed to publish log:${e}`);
        }
    }

    async updateLogsForNewUser(userId: string): Promise<void> {
        const logs = await this.fetchLogsFromLocal('logs');
        const updatePromises: Promise<void>[] = [];
        for (const log of logs) {
            if (!log.userId) {
                log.userId = userId;
                log.isPublic = false; // Set default value for isPublic
                // Update in Firebase
                const docRef = doc(this.logCollection, log.id);
                updatePromises.push(setDoc(docRef, log.toFirestore()));
                console.log('Updating log:', log.id);
            }
        }

        await Promise.all(updatePromises);
        localStorage.removeItem('logs');
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

    async getAllLogs(): Promise<Log[]> {
        const querySnapshot = await getDocs(this.logCollection);
        return querySnapshot.docs.map(doc => Log.fromFirestore(doc));
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
                        .catch((error) => {
                            console.error(`Error deleting:`, error);
                        })
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
            localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_GUEST_COLLECTION ?? 'logs', JSON.stringify(logs));
        }
    }

    async fetchLogsFromLocal(collection?: string): Promise<Log[]> {
        if (typeof window !== 'undefined') {
            const logs = localStorage.getItem(collection ? collection : process.env.NEXT_PUBLIC_LOCAL_GUEST_COLLECTION ?? '');
            if (logs) {
                const parsedLogs = JSON.parse(logs) as Log[];
                // Convert createdDate strings back to Date objects
                const logInstances = parsedLogs.map((log) => {
                    log.createdDate = new Date(log.createdDate);
                    if (log.expiryDate) {
                        log.expiryDate = new Date(log.expiryDate);
                    }
                    return new Log(log)
                });

                const filtered = logInstances.filter(log => !log.isExpired);

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

    async importLogFromGist(gistId: string): Promise<Log> {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_GITHUB_GIST_API}/${gistId}`);
            const gist = response.data;

            const firstFileName = Object.keys(gist.files)[0];
            const file = gist.files[firstFileName];
            const desc = gist.description;
            const content = file.content;
            if (!file) {
                throw new Error('No file found in the gist');
            }
            const log = new Log({
                data: content,
                type: LogType.TEXT,
                isMarkDown: false,
                title: desc,
                createdDate: new Date(),
                isPublic: true,
                isExpired: false,
                summary: '',
            });
            return log;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Gist not found');
                }
                throw new Error(`Failed to fetch gist: ${error.message}`);
            }
            throw error;
        }
    }

    getSummary = async (apiKey: string, log: Log) => {
        try {
            const genAI = new GoogleGenerativeAI(apiKey!);

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Summarize the following text by taking the title: ${log.title} and its description:` + log.data;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text();

            return summary
        } catch (error) {
            console.error("Error querying Gemini:", error);
        } finally {
        }
    };
}

export default LogService;
