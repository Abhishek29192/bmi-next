#!/usr/bin/env node
/**
 * A script to trigger a full fetch and build for _all_ markets.
 *
 * To run in Linux/MacOS:
 * ```bash
 * applications/dxb/scripts/allMarketFullFetch.js $(gcloud auth print-identity-token) qa
 * ```
 *
 * To run in Windows:
 * ```bat
 * gcloud auth print-identity-token
 * node applications\dxb\scripts\allMarketFullFetch.js [copied gcloud auth token] qa
 * ```
 *
 * ```powershell
 * node .\applications\dxb\scripts\allMarketFullFetch.js (gcloud auth print-identity-token) qa
 * ```
 */
"use strict";

const fetchRetry = require("@bmi/fetch-retry").default;

const markets = [
  {
    name: "Albania",
    countryCode: "al",
    preProduction: "9f35a879-20cd-4a90-9f3c-d0950ecfcd28",
    production: "75fa181c-c6ee-4acd-8ebc-560d7b5bf5ee"
  },
  {
    name: "Austria",
    countryCode: "at",
    preProduction: "d66bc99d-65d9-4b60-aac9-d1e12894e2aa",
    production: "5082bfbb-1d30-4c97-a8f2-cf6f0e1f4ca1"
  },
  {
    name: "Belgium NL",
    countryCode: "be",
    preProduction: "3e12746e-80b1-4a17-9cab-f993d4b57849",
    production: "a21f34bc-8a90-41ca-ac33-1fcfee45b54c"
  },
  {
    name: "Blueprint",
    production: "939b526c-084b-4dd8-9b6b-14626189cf69"
  },
  {
    name: "Bosnia and Herzegovinia",
    countryCode: "ba",
    preProduction: "c3d8a5e4-e4b0-49db-8dc0-f5bd403114d9",
    production: "658ac335-d688-453c-8dd8-08f7370254d2"
  },
  {
    name: "Bulgaria",
    countryCode: "bg",
    preProduction: "fb03bc4e-87ca-4200-808c-bffad263a11e",
    production: "726c4e1a-5a22-43cf-aab4-fa814a5809ea"
  },
  {
    name: "China",
    countryCode: "cn",
    preProduction: "025c0c1d-12bd-403c-afc2-737f66478a20",
    production: "dd1441da-8368-447a-9df0-4a18d507c722"
  },
  {
    name: "Croatia",
    countryCode: "hr",
    preProduction: "68bd7372-bd27-4efc-b241-1ecb496b041d",
    production: "21ddd56b-42d5-43e2-b2be-4ec0f629d357"
  },
  {
    name: "Czechia",
    countryCode: "cz",
    preProduction: "52d0f86f-940b-44b8-95ad-e9ca8a83bb0a",
    production: "5111182a-9684-4a54-8051-7e8e938b4925"
  },
  {
    name: "Germany",
    countryCode: "de",
    preProduction: "02118e58-bc87-47d5-bab8-15d1299032bb",
    production: "1cf8dff0-86e0-49b7-b402-26196aa10252"
  },
  {
    name: "Denmark",
    countryCode: "dk",
    preProduction: "206a0835-4298-4c6b-96c0-8b5d8ab1d10a",
    production: "44d418bc-302d-4b0c-b350-cbef56856230"
  },
  {
    name: "Estonia",
    countryCode: "ee",
    preProduction: "7a2ccba5-3ce1-4c96-bf7b-25bff5cd127a",
    production: "621bb286-d9cc-40d0-b677-f239502337fd"
  },
  {
    name: "Finland",
    countryCode: "fi",
    preProduction: "6110ab37-aead-43d5-bb3d-d5fdd0af0035",
    production: "fc634535-92fa-4d1c-bf22-6bb04e1bbb17"
  },
  {
    name: "France",
    countryCode: "fr",
    preProduction: "8b9abce0-f149-4365-82ea-db0b58edcbef",
    production: "58082730-33bd-428a-84e0-d5905f89ebc2"
  },
  {
    name: "Group",
    preProduction: "33209839-5b60-4c31-864f-98cb7ec986ff",
    production: "ab6e44e9-2b4c-4b23-96ac-2f092d8355ac"
  },
  {
    name: "Hungary",
    countryCode: "hu",
    preProduction: "113ffb4a-305c-4d28-b274-d15dbd3fd02e",
    production: "5ad3e4f6-06d1-483b-82bc-3696003b4886"
  },
  {
    name: "India",
    countryCode: "in",
    preProduction: "d5116565-fdb2-4161-9b9d-c47787be8d0e",
    production: "ba051863-0efa-4fab-b3f4-84c17b5228d3"
  },
  {
    name: "Indonesia",
    countryCode: "id",
    preProduction: "9a2ce061-a8a0-4579-abe1-e16c7f3dd335",
    production: "12dc0972-1f04-4bec-b2df-79a55947a390"
  },
  {
    name: "Italy",
    countryCode: "it",
    preProduction: "48c3d0b2-c89e-4ae2-a778-38fd5218c89b",
    production: "8dd7e0b4-b17b-487d-860e-90067b33872a"
  },
  {
    name: "Latvia",
    countryCode: "lv",
    preProduction: "10b02961-0269-4a2b-a318-bf9a5c1ecb34",
    production: "feb02e7c-a897-4d19-9622-252786a1cef7"
  },
  {
    name: "Lithuania",
    countryCode: "lt",
    preProduction: "045d311a-9401-451b-92a5-2603e13d6d45",
    production: "6bc36ff1-3015-4c58-b584-1d3834f7ef0b"
  },
  {
    name: "Malaysia",
    countryCode: "my",
    preProduction: "18f37ddf-10cb-4eaf-9748-08111b1356e2",
    production: "7a5de5cc-61e5-4b37-b816-bac405bf67ee"
  },
  {
    name: "Netherlands",
    countryCode: "nl",
    preProduction: "8a0abe62-a49f-406e-a98c-2d7aea00dffd",
    production: "0129ddd4-517c-4cc3-8b0c-086dd3a706ea"
  },
  {
    name: "Norway",
    countryCode: "no",
    qa: "527b7de1-e2b0-46fe-91f3-fb65b841a3fd",
    preProduction: "7242aa29-6e88-4dd1-a88c-0c94dc6fabe6",
    production: "ad0cca44-d3be-410c-a70d-1fdc9c361037"
  },
  {
    name: "Poland",
    countryCode: "pl",
    preProduction: "0d0a284d-6025-4c01-9c8a-9a9aa04f4c1e",
    production: "2128292b-223a-4ffe-bc58-e99458c60de2"
  },
  {
    name: "Portugal",
    countryCode: "pt",
    preProduction: "243ee67c-c329-401e-8cef-dfb23b5f07ba",
    production: "4b56913d-9ddc-4608-b6a7-c04a932da079"
  },
  {
    name: "Romania",
    countryCode: "ro",
    preProduction: "adfd372a-c660-4085-9c86-53422f56a090",
    production: "d7ed9cb9-61de-4a9f-8080-3dc41497cacd"
  },
  {
    name: "Sandpit",
    production: "74634df6-ee46-4ac5-b444-e87cb58a8050"
  },
  {
    name: "Saudi Arabia",
    countryCode: "sa",
    preProduction: "b294e96a-d328-4734-bd95-c617c5a20724",
    production: "92c3697e-e456-4158-913c-bb38eb1f1b75"
  },
  {
    name: "Serbia",
    countryCode: "rs",
    preProduction: "c5b57541-2385-4fee-98ba-0185c24b6a33",
    production: "1ed0ab15-f8b1-46cb-bae6-a4c090bb9296"
  },
  {
    name: "Slovakia",
    countryCode: "sk",
    preProduction: "b3e830b3-044e-4dca-95a8-d2f7a27426a3",
    production: "593164e7-6db0-4e45-8a5c-6951e72d6d69"
  },
  {
    name: "Slovenia",
    countryCode: "sl",
    preProduction: "a2c4fbeb-3aeb-4545-b416-681f62199c68",
    production: "a9c8a927-1647-4ad8-b01d-de8ffb1d801b"
  },
  {
    name: "South Africa",
    countryCode: "za",
    preProduction: "e319ff60-92fc-4bd4-9290-245fc5865224",
    production: "7459f657-4563-4757-a7ce-35428d48cf6a"
  },
  {
    name: "Spain",
    countryCode: "es",
    preProduction: "3cb0b4dc-1aaf-4951-97f0-608c168b8cdc",
    production: "1879d6c9-3707-4e0f-8e63-716f942e3dda"
  },
  {
    name: "Sweden",
    countryCode: "se",
    preProduction: "6017e852-688a-4d97-a4f1-2aa8a41f4f04",
    production: "387c388a-6000-4538-bfad-0f5aeaee5aaf"
  },
  {
    name: "Switzerland DE",
    countryCode: "ch",
    preProduction: "5c911c04-f7fd-4368-8b92-b6b70674facc",
    production: "12a2d7e4-7c1c-4906-b48e-6478ff85c2f4"
  },
  {
    name: "Turkey",
    countryCode: "tr",
    preProduction: "1dd56c6d-f7e3-46ae-b378-97eb13f26af6",
    production: "65c3e3c1-7148-408f-b337-aa5c14d60478"
  },
  {
    name: "United Arab Emirates",
    countryCode: "ae",
    preProduction: "4081e44f-0b7c-451f-98d6-942061176016",
    production: "fa66148b-500a-44e3-9e21-210f2451610b"
  },
  {
    name: "United Kingdom",
    countryCode: "uk",
    preProduction: "98c9f647-b580-4561-babb-b4fb002e1cfb",
    production: "f314ace5-e035-4a8f-b986-3b50f6e0f454"
  }
];

const getFullFetchTrigger = (environment, market) => {
  if (environment === "qa") {
    return `https://europe-west3-bmi-np-dxb-compute-qa.cloudfunctions.net/bmi-np-pimtodxb-fullcat-coordinator-${market.countryCode}-qa-europe-west3`;
  }
  if (environment === "preProduction") {
    return `https://europe-west3-bmi-np-dxb-compute-preprod.cloudfunctions.net/bmi-np-pimtodxb-fullcat-coordinator-${market.countryCode}-preprod-europe-west3`;
  }
  if (environment === "production") {
    return `https://europe-west3-bmi-p-dxb-compute-${market.region}.cloudfunctions.net/bmi-p-pimtodxb-fullcat-coordinator-${market.countryCode}-${market.region}-europe-west3`;
  }
  return undefined;
};

const triggerFullFetch = async (gcloudAuthToken, environment, market) => {
  if (!market.countryCode) {
    console.info(`${market.name} does not have PIM data to full fetch`);
    return;
  }
  console.info(`Triggering full fetch for ${market.name}`);
  const fullFetchTrigger = getFullFetchTrigger(environment, market);
  if (fullFetchTrigger) {
    await fetchRetry(fullFetchTrigger, {
      headers: {
        Authorization: `Bearer ${gcloudAuthToken}`
      }
    });
    console.info(`Triggered full fetch for ${market.name}`);
    await new Promise((resolve) => setTimeout(resolve, 120000));
  }
};

const triggerSiteBuild = async (environment, market) => {
  console.info(`Triggering site build for ${market.name}`);
  const siteTriggerResponse = await fetchRetry(
    // eslint-disable-next-line security/detect-object-injection
    `https://webhook.gatsbyjs.com/hooks/builds/trigger/${market[environment]}`,
    {
      method: "POST",
      headers: { "x-gatsby-cache": false }
    }
  );
  if (!siteTriggerResponse.ok) {
    const body = await siteTriggerResponse.text();
    console.error(
      `Failed to trigger a site build: ${siteTriggerResponse.stats}\n${body}`
    );
    return;
  }
  console.info(`Triggered site build for ${market.name}`);
};

const main = async (args) => {
  const gcloudAuthToken = args[0];
  const environment = args[1];
  const marketsToRun = args.splice(2);
  await Promise.allSettled(
    markets
      .filter(
        (market) =>
          marketsToRun.length === 0 ||
          marketsToRun.find((marketCode) => marketCode === market.countryCode)
      )
      .map(async (market) => {
        // eslint-disable-next-line security/detect-object-injection
        if (!market[environment]) {
          console.info(`${market.name} is not available in ${environment}`);
          return;
        }
        try {
          await triggerFullFetch(gcloudAuthToken, environment, market);
          await triggerSiteBuild(environment, market);
        } catch (error) {
          console.error(error.message);
        }
      })
  );
};

main(process.argv.slice(2)).then(() => {
  console.info("Finished full fetch for all markets");
});
