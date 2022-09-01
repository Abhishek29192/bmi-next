#!/usr/bin/env node
/**
 * A script to get a backup of _all_ Contentful spaces.
 *
 * Before running, ensure that the Contentful CLI has been installed (using `npm install -g contentful-cli`.
 *
 * To run in Linux/MacOS:
 * ```bash
 * applications/dxb/scripts/backupAllMarketsContentful.js [Contentful access token]
 * ```
 *
 * To run in Windows:
 * ```bat
 * node applications\dxb\scripts\backupAllMarketsContentful.js [Contentful access token]
 * ```
 *
 * ```powershell
 * node .\applications\dxb\scripts\backupAllMarketsContentful.js [Contentful access token]
 * ```
 */
"use strict";

// eslint-disable-next-line security/detect-child-process
const { spawnSync } = require("child_process");

const markets = [
  {
    name: "Albania",
    countryCode: "al"
  },
  {
    name: "Austria",
    countryCode: "at",
    spaceId: "6s50ptwznz42"
  },
  {
    name: "Belgium NL",
    countryCode: "be",
    spaceId: "u6rfet9uekn5"
  },
  {
    name: "Blueprint",
    spaceId: "x47somwauesy"
  },
  {
    name: "Bosnia and Herzegovinia",
    countryCode: "ba"
  },
  {
    name: "Bulgaria",
    countryCode: "bg"
  },
  {
    name: "China",
    countryCode: "cn"
  },
  {
    name: "Croatia",
    countryCode: "hr"
  },
  {
    name: "Czechia",
    countryCode: "cz"
  },
  {
    name: "Denmark",
    countryCode: "dk"
  },
  {
    name: "Estonia",
    countryCode: "ee"
  },
  {
    name: "Finland",
    countryCode: "fi",
    spaceId: "tftppmlbvtvx"
  },
  {
    name: "France",
    countryCode: "fr",
    spaceId: "h1lj96ycs4pf"
  },
  {
    name: "Germany",
    countryCode: "de",
    spaceId: "g371mt5z8v98"
  },
  {
    name: "Group",
    spaceId: "nc8kredfyq6g"
  },
  {
    name: "Hungary",
    countryCode: "hu"
  },
  {
    name: "India",
    countryCode: "in"
  },
  {
    name: "Indonesia",
    countryCode: "id",
    spaceId: "6o3iavbfq3zv"
  },
  {
    name: "Italy",
    countryCode: "it",
    spaceId: "ue75nswzga4t"
  },
  {
    name: "Latvia",
    countryCode: "lv"
  },
  {
    name: "Lithuania",
    countryCode: "lt"
  },
  {
    name: "Malaysia",
    countryCode: "my",
    spaceId: "jj837y5jvazp"
  },
  {
    name: "Netherlands",
    countryCode: "nl",
    spaceId: "lfak71yt7qkj"
  },
  {
    name: "Norway",
    countryCode: "no",
    spaceId: "18fop5x17y3g"
  },
  {
    name: "Poland",
    countryCode: "pl",
    spaceId: "frtuemjkldn3"
  },
  {
    name: "Portugal",
    countryCode: "pt",
    spaceId: "5gurbfyck794"
  },
  {
    name: "Romania",
    countryCode: "ro",
    spaceId: "zpnb1ulje7lm"
  },
  {
    name: "Sandpit",
    spaceId: "xd0cdgm332jz"
  },
  {
    name: "Saudi Arabia",
    countryCode: "sa"
  },
  {
    name: "Serbia",
    countryCode: "rs"
  },
  {
    name: "Slovakia",
    countryCode: "sk"
  },
  {
    name: "Slovenia",
    countryCode: "sl"
  },
  {
    name: "South Africa",
    countryCode: "za",
    spaceId: "781472ve2j7g"
  },
  {
    name: "Spain",
    countryCode: "es",
    spaceId: "e4amtpm56u6l"
  },
  {
    name: "Sweden",
    countryCode: "se"
  },
  {
    name: "Switzerland DE",
    countryCode: "ch"
  },
  {
    name: "Turkey",
    countryCode: "tr",
    spaceId: "4xaxldkjl6l6"
  },
  {
    name: "United Arab Emirates",
    countryCode: "ae"
  },
  {
    name: "United Kingdom",
    countryCode: "uk",
    spaceId: "cd81nrotvav2"
  }
];

const main = async (args) => {
  const accessToken = args[0];
  if (!accessToken) {
    throw Error("Contentful access token was not provided.");
  }

  const marketsToRun = args.splice(1);
  const allBackups = await Promise.allSettled(
    markets
      .filter(
        (market) =>
          market.spaceId &&
          (marketsToRun.length === 0 ||
            marketsToRun.find(
              (marketCode) => marketCode === market.countryCode
            ))
      )
      .map(async (market) => {
        console.info(`Backing up ${market.name}`);
        const spawnSyncReturns = spawnSync(
          "contentful",
          [
            "space",
            "export",
            "--space-id",
            market.spaceId,
            "--environment-id",
            "master",
            "--mt",
            accessToken,
            "--include-drafts",
            "--skip-roles",
            "--skip-webhooks",
            "--content-file",
            `${market.name.replace(/ /g, "-").toLowerCase()}-dump.json`
          ],
          { stdio: "inherit" }
        );
        if (spawnSyncReturns.status !== 0) {
          throw new Error(`Failed to backup ${market.name}`);
        }
      })
  );

  const reasons = allBackups
    .filter((backup) => backup.status === "rejected")
    .map((backup) => backup.reason.message);
  if (reasons.length !== 0) {
    throw new Error(`Failed to backup some spaces: ${JSON.stringify(reasons)}`);
  }
};

main(process.argv.slice(2))
  .then(() => {
    console.info("Finished full fetch for all markets");
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
