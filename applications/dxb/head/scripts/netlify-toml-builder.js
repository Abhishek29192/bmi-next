"use strict";

const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV || "development"}` // needs fallback
});

//debug
//console.log(process.env);

const buildContent = () => {
  const templateFile = path.resolve(__dirname, "../netlify.toml");

  const redirectsFile = path.resolve(
    __dirname,
    "../redirects_" + process.env.SPACE_MARKET_CODE.toLowerCase() + ".toml"
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (fs.existsSync(redirectsFile)) {
    const fileOut = path.resolve(__dirname, "../netlify.toml");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const templateContent = fs.readFileSync(templateFile, "utf-8");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const redirectsContent = fs.readFileSync(redirectsFile, "utf-8");
    const redirectsMarker = "# *** REDIRECTS_START_HERE ***";
    const newContent = templateContent.replace(
      redirectsMarker,
      redirectsContent
    );

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(fileOut, newContent);
  } else {
    console.warn("redirects file for selected market could not be found");
  }
};

if (!process.env.SPACE_MARKET_CODE) {
  console.error(
    "Please provide a value for Environment Variable 'process.env.SPACE_MARKET_CODE'."
  );
  process.exit(1);
}

console.log(
  "** Generating netlify toml file from template + market redirects for code:" +
    process.env.SPACE_MARKET_CODE +
    " **"
);

buildContent();

console.log("** Done generating netlify toml file");
