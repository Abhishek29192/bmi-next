/*
Copy of https://github.com/taessina/gatsby-source-firestore/blob/master/gatsby-node.js,
but as the latest changes have not been released and it's no longer supported, brought in here.

Potentially we should fork the project properly and open-source it with a release.
*/

"use strict";

const report = require("gatsby-cli/lib/reporter");
const firebase = require("firebase-admin");

exports.sourceNodes = async (
  { createContentDigest, actions },
  { types, credential, appConfig }
) => {
  try {
    if (firebase.apps && !firebase.apps.length) {
      const cfg = appConfig
        ? appConfig
        : { credential: firebase.credential.cert(credential) };
      firebase.initializeApp(cfg);
    }
  } catch (e) {
    report.warn(
      "Could not initialize Firebase. Please check `credential` property in gatsby-config.js"
    );
    report.warn(e);
    return;
  }
  const db = firebase.firestore();
  db.settings({
    timestampsInSnapshots: true
  });

  const { createNode } = actions;

  const promises = types.map(
    async ({ collection, type, map = (node) => node }) => {
      const snapshot = await db.collection(collection).get();
      for (let doc of snapshot.docs) {
        const contentDigest = createContentDigest(doc.data());
        createNode(
          Object.assign({}, map(doc.data()), {
            id: doc.id,
            parent: null,
            children: [],
            internal: {
              type,
              contentDigest
            }
          })
        );
        Promise.resolve();
      }
    }
  );
  await Promise.all(promises);
  return;
};
