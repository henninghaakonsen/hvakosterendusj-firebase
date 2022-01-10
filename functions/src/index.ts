import * as functions from "firebase-functions";
const fetch = require("node-fetch");

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.

// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
admin.initializeApp();

export const hent_dagens_strompriser = functions.https.onRequest(
  async (_, res) => {
    res.set("Access-Control-Allow-Origin", "*");

    const idag = new Date();
    const dato = idag.toISOString().substr(0, 10);

    const readResult = await admin
      .firestore()
      .collection("strompriser")
      .doc(dato)
      .get();

    if (readResult.exists) {
      res.json(readResult.data());
    } else {
      fetch(
        `https://norway-power.ffail.win/?zone=NO1&date=${idag
          .toISOString()
          .substr(0, 10)}&key=1eb42d77-04f2-4182-b4a2-282c4056a7ac`
      )
        .then((response: any) => response.json())
        .then(async (data: any) => {
          await admin
            .firestore()
            .collection("strompriser")
            .doc(dato)
            .set(data);

          res.json(data);
        });
    }
  }
);
