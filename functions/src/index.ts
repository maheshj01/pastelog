/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = app.firestore();

const logCollection = "logs";

export const updateLogs = functions.scheduler.onSchedule(
    {
      schedule: "0 0 * * *", // Runs at midnight UTC every day
      timeZone: "Etc/UTC",
      retryCount: 3,
      memory: "256MiB", // Optional: Customize memory allocation
      timeoutSeconds: 60, // Optional: Set timeout for the function
    },

    async (event: any) => {
      try {
        const logsCollection = db.collection("logs");
        const logsSnapshot = await logsCollection.get();
        console.log(`Checking for expired logs... in ${logCollection} against ${logsSnapshot.size} documents`);
        if (logsSnapshot.empty) {
          console.log("Not found in logs collection....");
          return; // Return nothing instead of null
        }

        const currentDate = new Date();
        const batch = db.batch();

        logsSnapshot.forEach((doc) => {
          const logData = doc.data();
          const expiryDateString = logData.expiryDate;

          // Ensure expiryDate is correctly parsed
          const expiryDate = expiryDateString ? new Date(expiryDateString) : null;

          // Convert both dates to UTC to ensure correct comparison
          const isExpired = expiryDate ? expiryDate.getTime() <= currentDate.getTime() : false;

          batch.update(doc.ref, {isExpired});
        });

        await batch.commit();
        console.log("Expiry check and update completed.");
        return;
      } catch (error) {
        console.error("Error checking expiry:", error);
      }
    }
);

// move collections with `isExpired` to "expiredNotes"
export const moveExpiredLogs = functions.scheduler.onSchedule(
    {
      // Run once every week at midnight UTC on Sunday
      schedule: "0 0 * * 0",
      timeZone: "Etc/UTC",
      retryCount: 3,
      memory: "256MiB",
      timeoutSeconds: 60,
    },
    async () => {
      try {
        const logsCollection = db.collection("logs");
        const expiredNotesCollection = db.collection("expiredNotes");

        // Fetch expired logs
        const expiredLogsSnapshot = await logsCollection.where("isExpired", "==", true).get();
        const logsSnapshot = await logsCollection.get();
        console.log(`Found ${expiredLogsSnapshot.size} expired logs. Total logs: ${logsSnapshot.size}`);
        if (expiredLogsSnapshot.empty) {
          console.log("No expired logs found.");
          return;
        }

        const batch = db.batch();
        expiredLogsSnapshot.forEach((doc) => {
          const docData = doc.data();

          // Move to expiredNotes collection
          const expiredDocRef = expiredNotesCollection.doc(doc.id);
          batch.set(expiredDocRef, docData);

          // Delete from logs collection
          batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`Moved ${expiredLogsSnapshot.size} expired logs to expiredNotes and deleted them from logs.`);
      } catch (error) {
        console.error("Error moving expired logs:", error);
      }
    }
);
