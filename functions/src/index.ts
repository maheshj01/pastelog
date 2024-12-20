/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();
const db = admin.firestore();
const logCollection = `${process.env.NEXT_PUBLIC_FIREBASE_COLLECTION}`;

export const updateExpiredLogs = functions.scheduler.onSchedule(
    {
      schedule: "0 0 * * *", // Runs at midnight UTC every day
      timeZone: "Etc/UTC",
      retryCount: 3,
      memory: "256MiB", // Optional: Customize memory allocation
      timeoutSeconds: 60, // Optional: Set timeout for the function
    },
    async (event) => {
      try {
        const logsCollection = db.collection(logCollection);
        const logsSnapshot = await logsCollection.get();

        if (logsSnapshot.empty) {
          console.log("No documents found in logs collection.");
          return; // Return nothing instead of null
        }

        const currentDate = new Date();
        const batch = db.batch();

        logsSnapshot.forEach((doc) => {
          const logData = doc.data();
          const expiryDate = logData.expiryDate ? new Date(logData.expiryDate) : null;

          const isExpired = expiryDate ? expiryDate <= currentDate : false;

          batch.update(doc.ref, {isExpired});
        });

        await batch.commit();
        console.log("Expiry check and update completed.");
        return; // Return nothing instead of null
      } catch (error) {
        console.error("Error checking expiry:", error);
      }
    }
);
