#!/usr/bin/env node
/**
 * A script to trigger create roles for provided markets in contentful space.
 *
 * To run in Linux/MacOS:
 * ```bash
 * applications/dxb/scripts/updateContentfulSpaceRoles.js
 * ```
 *
 * To run in Windows:
 * ```bat
 * node applications\dxb\scripts\updateContentfulSpaceRoles.js
 * ```
 *
 * ```powershell
 * node .\applications\dxb\scripts\updateContentfulSpaceRoles.js
 * ```
 */
"use strict";

const fetchRetry = require("@bmi/fetch-retry").default;

// provide CONTENTFUL_MANAGEMENT_TOKEN
const CONTENTFUL_MANAGEMENT_TOKEN = "";
// provide CONTENTFUL_SPACE_ID
const CONTENTFUL_SPACE_ID = "";
// provide ROLE_ID
const ROLE_ID = "";
/*
 *  update request role permission body
 *
 *   const body = {
 *     "name": "DXB - updated content editor name"
 *   }
 */
const body = null;

const main = async () => {
  if (body) {
    try {
      await fetchRetry(
        `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/roles/${ROLE_ID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${CONTENTFUL_MANAGEMENT_TOKEN}`,
            "Content-Type": "application/vnd.contentful.management.v1+json"
          },
          body: JSON.stringify(body)
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  } else {
    console.info(
      `Please provide new permissions to update the role - ${ROLE_ID}`
    );
  }
};

main().then(() => {
  console.info(`Updated contentful role - ${ROLE_ID}`);
});
