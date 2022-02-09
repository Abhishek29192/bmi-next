#!/usr/bin/env node
"use strict";

// eslint-disable-next-line security/detect-child-process
const { spawnSync } = require("child_process");
const { existsSync, mkdirSync } = require("fs");
const { join } = require("path");
require("./env");

const main = async ([command = "--help", ...options]) => {
  const { SPACE_ID, MANAGEMENT_ACCESS_TOKEN, PROJECT_RELATIVE_PATH } =
    process.env;

  try {
    if (!SPACE_ID || !MANAGEMENT_ACCESS_TOKEN || !PROJECT_RELATIVE_PATH)
      throw Error(
        "Missing env config `SPACE_ID` or `MANAGEMENT_ACCESS_TOKEN` or `PROJECT_RELATIVE_PATH`"
      );

    const projectPath = join(__dirname, PROJECT_RELATIVE_PATH);
    if (!existsSync(projectPath)) {
      mkdirSync(projectPath);
    }

    var isWin = process.platform === "win32";
    const sub = spawnSync(
      isWin ? "ctf-migrate.cmd" : "ctf-migrate",
      [command, "-s", SPACE_ID, "-t", MANAGEMENT_ACCESS_TOKEN, ...options],
      {
        stdio: "inherit",
        cwd: projectPath
      }
    );

    process.exit(sub.status);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

main(process.argv.slice(2));
