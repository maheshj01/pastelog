/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";

admin.initializeApp();
const db = admin.firestore(
  functions.config().firebase
);
const logCollection = "logs";

export const updateLogs = functions.pubsub.schedule(
  "every 24 hours",
).onRun(async () => {
  try {
    const totalCollections = await db.listCollections();
    console.log(`Checking for expired logs in ${totalCollections.length} collections...`);
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
      console.log(`Doc ID: ${doc.id}, Expiry Date: ${expiryDate}, Current Date: ${currentDate}, Is Expired: ${isExpired}`);
      batch.update(doc.ref, { isExpired });
    });

    await batch.commit();
    console.log("Expiry check and update completed.");
    return;
  } catch (error) {
    console.error("Error checking expiry:", error);
  }
}
);
