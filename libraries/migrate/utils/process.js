"use strict";

module.exports.isDryRun = Boolean(
  process.argv.slice(2).find((arg) => arg.includes("--dry-run") || arg === "-d")
);
