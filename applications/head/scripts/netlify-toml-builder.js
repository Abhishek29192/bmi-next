"use strict";

const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV || "development"}` // needs fallback
});

//debug
//console.log(process.env);

const buildContent = () => {
  const templateFile = path.resolve(__dirname, "../netlify_template.toml");
  const redirectsFile = path.resolve(
    __dirname,
    "../redirects_" + process.env.SPACE_MARKET_CODE + ".toml"
  );
  const fileOut = path.resolve(__dirname, "../netlify.toml");
  const fileContentIn = fs.readFileSync(templateFile, "utf-8");
  const fileContentIn2 = fs.readFileSync(redirectsFile, "utf-8");

  fs.writeFileSync(fileOut, fileContentIn + fileContentIn2);
};

console.log(
  "** Generating netlify toml file from template + market redirects for code:" +
    process.env.SPACE_MARKET_CODE +
    " **"
);

buildContent();

console.log("** Done generating netlify toml file");
