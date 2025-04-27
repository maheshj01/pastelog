/* eslint-disable max-len */
import * as admin from "firebase-admin";
import {Timestamp} from "firebase-admin/firestore";
import {defineSecret} from "firebase-functions/params";
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
        console.log(
            `Checking for expired logs... in ${logCollection} against ${logsSnapshot.size} documents`
        );
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
          const expiryDate = expiryDateString ?
          new Date(expiryDateString) :
          null;

          // Convert both dates to UTC to ensure correct comparison
          const isExpired = expiryDate ?
          expiryDate.getTime() <= currentDate.getTime() :
          false;

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
      secrets: ["EXPIRED_COLLECTION", "NOTES_COLLECTION"],
    },
    async () => {
      try {
        const expiredCollection = defineSecret("EXPIRED_COLLECTION");
        const notesCollection = defineSecret("NOTES_COLLECTION");
        const logsCollection = db.collection(notesCollection.value());
        const expiredNotesCollection = db.collection(
            expiredCollection.value()
        );
        const now = Timestamp.now(); // Current timestamp

        const logsSnapshot = await logsCollection.get();

        console.log(`Total logs fetched: ${logsSnapshot.size}`);

        if (logsSnapshot.empty) {
          console.log("No logs found.");
          return;
        }

        const batch = db.batch();

        let expiredMovedCount = 0;
        let skippedNoExpiryCount = 0;
        let invalidFormatCount = 0;

        logsSnapshot.forEach((doc) => {
          const docData = doc.data();
          const expiryDate = docData.expiryDate;

          if (!expiryDate) {
            skippedNoExpiryCount++;
            return;
          }

          if (expiryDate instanceof Timestamp) {
            if (expiryDate.toMillis() <= now.toMillis()) {
              const docRef = logsCollection.doc(doc.id);
              batch.update(docRef, {isExpired: true});

              const expiredDocRef = expiredNotesCollection.doc(
                  doc.id
              );
              batch.set(expiredDocRef, {
                ...docData,
                isExpired: true,
              });

              batch.delete(docRef);

              expiredMovedCount++;
            }
          } else {
            invalidFormatCount++;
          }
        });

        await batch.commit();

        console.log("✅ Migration completed!");
        console.log(`- Expired logs moved: ${expiredMovedCount}`);
        console.log(`- Logs without expiryDate: ${skippedNoExpiryCount}`);
        console.log(
            `- Logs with invalid expiryDate format: ${invalidFormatCount}`
        );
      } catch (error) {
        console.error("Error moving expired logs:", error);
      }
    }
);
