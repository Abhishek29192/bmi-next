#!/usr/bin/env node
"use strict";

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
require("dotenv").config();
const { createFiles } = require("./util");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  // Check if we have previously stored a token.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getData(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: process.env.GOOGLE_SPREADSHEET_RANGE
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      exportFile(res.data.values);
    }
  );
}
function exportFile(data) {
  if (!data.length) return console.log("There is no data in the spreadsheet:");
  const columnCount = data[0].length;
  const csv = data
    .map((item) => {
      return item.length === columnCount
        ? item.map((k) => `"${k}"`)
        : item
            .map((k) => `"${k}"`)
            .concat(",".repeat(columnCount - item.length - 1));
    })
    .join("\n");
  createFiles(csv);
}

authorize(getData);

// [END sheets_quickstart]

module.exports = {
  SCOPES,
  getData
};
