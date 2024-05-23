import firebase from "firebase-admin";

export const onPreBuild = async function ({ netlifyConfig, utils, inputs }) {
  const credential = {
    type: "service_account",
    project_id:
      netlifyConfig.build.environment.GLOBAL_GCP_PROJECT_ID ||
      netlifyConfig.build.environment.GCP_PROJECT_ID,
    private_key_id:
      netlifyConfig.build.environment.GLOBAL_FIRESTORE_PRIVATE_KEY_ID ||
      netlifyConfig.build.environment.FIRESTORE_PRIVATE_KEY_ID,
    private_key: (
      netlifyConfig.build.environment.GLOBAL_FIRESTORE_PRIVATE_KEY ||
      netlifyConfig.build.environment.FIRESTORE_PRIVATE_KEY ||
      ""
    ).replace(/\\n/gm, "\n"),
    client_email:
      netlifyConfig.build.environment.GLOBAL_FIRESTORE_CLIENT_EMAIL ||
      netlifyConfig.build.environment.FIRESTORE_CLIENT_EMAIL,
    client_id:
      netlifyConfig.build.environment.GLOBAL_FIRESTORE_CLIENT_ID ||
      netlifyConfig.build.environment.FIRESTORE_CLIENT_ID,
    auth_uri:
      netlifyConfig.build.environment.GLOBAL_FIRESTORE_AUTH_URI ||
      netlifyConfig.build.environment.FIRESTORE_AUTH_URI,
    token_uri:
      netlifyConfig.build.environment.GLOBAL_FIRESTORE_TOKEN_URI ||
      netlifyConfig.build.environment.FIRESTORE_TOKEN_URI,
    auth_provider_x509_cert_url:
      netlifyConfig.build.environment
        .GLOBAL_FIRESTORE_AUTH_PROVIDER_X509_CERT_URL ||
      netlifyConfig.build.environment.FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:
      netlifyConfig.build.environment.GLOBAL_FIRESTORE_CLIENT_X509_CERT_URL ||
      netlifyConfig.build.environment.FIRESTORE_CLIENT_X509_CERT_URL
  };

  const cfg = { credential: firebase.credential.cert(credential) };
  firebase.initializeApp(cfg);

  const db = firebase.firestore();
  const collectionName =
    netlifyConfig.build.environment.FIRESTORE_CSP_COLLECTION || "dxb-csp";
  const collectionRef = db.collection(collectionName);

  const marketCode = netlifyConfig.build.environment.GATSBY_SPACE_MARKET_CODE;

  const docName = `csp_${docSuffix(marketCode)}`;
  const docRef = collectionRef.doc(docName);
  const doc = await docRef.get();
  if (!doc) {
    utils.build.failPlugin(
      `Content Security Policy document : ${docName} not found.`
    );
    return;
  }

  if (!doc.data()?.policy) {
    utils.build.failPlugin(
      `Content Security Policy is empty for ${marketCode}.`
    );
    return;
  }
  // Netlify expects the less specific redirects above the more specific redirects
  netlifyConfig.headers.push({
    for: "/*",
    values: { "Content-Security-Policy": doc.data()?.policy }
  });

  if (marketCode === "grp") {
    const errors = [];

    // loop all markets serially
    for (const marketPrefix of inputs.dxbMarketPrefixes
      .split(",")
      .map((p) => p.trim())) {
      const docName = `csp_${docSuffix(marketPrefix)}`;
      const docRef = collectionRef.doc(docName);
      const doc = await docRef.get();

      if (!doc) {
        errors.push(`Content Security Policy document : ${docName} not found.`);
        continue;
      }

      if (!doc.data()?.policy) {
        errors.push(`Content Security Policy is empty for ${marketPrefix}.`);
        continue;
      }

      netlifyConfig.headers.push({
        for: `/${marketPrefix}/*`,
        values: { "Content-Security-Policy": doc.data()?.policy }
      });
    }

    if (errors.length > 0) {
      utils.build.failPlugin(errors.join(", "));
      return;
    }
  }
};

// Builds the market document suffix in the form 'no' or 'fr-be' (for bilingual markets).
const docSuffix = (marketCode) => {
  // align the mismatches between terrafrom and country codes
  if (marketCode === "ch/fr-ch") {
    return "frch";
  }
  if (marketCode === "ua") {
    return "ae";
  }
  return `${marketCode.split("/").pop().toLowerCase()}`;
};
