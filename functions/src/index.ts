import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp(functions.config().firebase);

// Run functions every 7 days
exports.scheduledFunction = functions.pubsub
  .schedule("0 * */7 * *")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const colRef = await admin.firestore().collection("logs").get();
    for (let index = 0; index < colRef.docs.length; index++) {
      const docRef = colRef.docs[index];
      let expiryDate = new Date(docRef.data()["expiryDate"]);
      console.log(expiryDate);
      let today = new Date();
      console.log(today);
      if (expiryDate < today) {
        await docRef.ref.delete();
      }
    }
  });
