#!/usr/bin/env node
/* eslint-disable security/detect-non-literal-fs-filename */

"use strict";

const fs = require("fs");
const path = require("path");

const replaceToken = () => {
  const file = path.resolve(__dirname, "../netlify.toml");
  const fileContent = fs.readFileSync(file, "utf-8");

  fs.writeFileSync(
    file,
    fileContent
      .replace("CONTENT_SECURITY_POLICY", process.env.CONTENT_SECURITY_POLICY)
      .replace("X_ROBOTS_TAG", process.env.X_ROBOTS_TAG)
      .replace(
        "ACCESS_CONTROL_ALLOW_ORIGIN",
        process.env.ACCESS_CONTROL_ALLOW_ORIGIN
      )
  );
};

replaceToken();
