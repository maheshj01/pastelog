// src/services/LogService.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { Log, LogType } from '../_models/Log';
import FeatureService from "./feature";
class LogService {
    private logCollection = collection(db, `${process.env.NEXT_PUBLIC_FIREBASE_COLLECTION}`);
    private configCollection = collection(db, `${process.env.NEXT_PUBLIC_FIREBASE_CONFIG_COLLECTION}`);
    private featureService: FeatureService = new FeatureService();
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
        // Fetch user-specific logs with isExpired = false
        const userQuery = query(
            this.logCollection,
            where('userId', '==', userId),
            where('isExpired', '==', false),
            orderBy('lastUpdatedAt', 'desc')
        );
        const userQuerySnapshot = await getDocs(userQuery);
        const userLogs = userQuerySnapshot.docs.map(doc => Log.fromFirestore(doc));

        // Fetch public logs
        const publicIdLogs = ['getting-started', 'shortcuts'];
        const publicLogPromises = publicIdLogs.map(async (id) => {
            const docRef = doc(this.logCollection, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? Log.fromFirestore(docSnap) : null;
        });

        const publicLogs = (await Promise.all(publicLogPromises)).filter((log): log is Log => log !== null);

        // Combine user logs and public logs
        const combinedLogs = [...userLogs, ...publicLogs];

        // Remove duplicates (in case a user has a personal copy of a public log)
        const uniqueLogs = combinedLogs.reduce((acc: Log[], current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        return uniqueLogs;//.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
    }

    async publishLog(log: Log): Promise<string> {
        try {
            const docRef = await addDoc(this.logCollection, log.toFirestore());
            if (docRef.id) {
                // if user not loggedIn save to local
                if (!log.userId) {
                    await this.saveLogToLocal({
                        ...log, id: docRef.id,
                        toFirestore: function () {
                            throw new Error('Function not implemented.');
                        }
                    });
                }
                return docRef.id!
            } else {
                throw new Error("Failed to publish log");
            }
        } catch (e) {
            throw new Error(`Failed to publish log:${e}`);
        }
    }

    async updateLogsForNewUser(userId: string): Promise<void> {
        const logs = await this.fetchLogsFromLocal('logs');
        const updatePromises: Promise<void>[] = [];
        const publicLogs = ['getting-started', 'shortcuts'];
        for (const log of logs) {
            if (!log.userId && !publicLogs.includes(log.id!)) {
                log.userId = userId;
                log.isPublic = false; // Set default value for isPublic
                // Update in Firebase
                const docRef = doc(this.logCollection, log.id);
                updatePromises.push(setDoc(docRef, log.toFirestore()));
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
        const data = log.toFirestore();
        console.log("updating data:", data);
        // await this.saveLogToLocal(log);
        // Remove any undefined fields
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
        await updateDoc(docRef, data);
    }

    async updateLogTitle(id: string, log: Log): Promise<void> {
        const docRef = doc(this.logCollection, id);
        await updateDoc(docRef, { title: log.title, lastUpdatedAt: new Date().toUTCString() });
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
        const checked = await this.featureService.shouldDeleteExpired()
        if (checked) {
            const querySnapshot = await getDocs(this.logCollection);
            const updatePromises: Promise<void>[] = [];
            const today = new Date();

            querySnapshot.forEach((doc) => {
                const log = Log.fromFirestore(doc);
                if (log.expiryDate && new Date(log.expiryDate) < today) {
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
                    if (!log.lastUpdatedAt) {
                        log.lastUpdatedAt = log.createdDate;
                    }
                    return new Log(log)
                });

                const filtered = logInstances.filter(log => !log.isExpired);

                // sort by lastUpdate in reverse order
                return filtered.sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
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
                createdDate: new Date().toUTCString(),
                lastUpdatedAt: new Date().toUTCString(),
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

    generateTitle = async (apiKey: string, log: Log) => {
        try {
            const genAI = new GoogleGenerativeAI(apiKey!);
            const model = genAI.getGenerativeModel({
                model: "gemini-pro"
            });
            const prompt = `Generate a new title under 30 chars for for the following piece of text whose current title: ${log.title} and the content: ${log.data}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const title = response.text();
            console.log("response title:", title);
            // Strip Markdown manually (simple regex for common elements)
            const parsedTitle = title.replace(/[#*_`]/g, '').trim();
            console.log("response title:", parsedTitle);
            return parsedTitle
        } catch (error) {
            console.error("Error querying Gemini:", error);
        } finally {
        }
    }
}

export default LogService;
