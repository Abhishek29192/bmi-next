#!/usr/bin/env node
"use strict";

/* 
This code block is taken from the @kimnobaydd
https://gist.github.com/kimnobaydd/70b8c9fe6ccd21733c8dbd3abad22b49
*/

const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const writeFile = (fileName, data) => {
  const dir = "./data";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const path = `${dir}/${fileName}`;
  fs.writeFile(path, data, function (err) {
    if (err) return console.log(err);
  });
};

const writeSql = (records) => {
  let alltables = "";
  let thistable = "";
  let firsttable = true;
  let currentTable = "";
  let allenums = "";
  let thisenum = "";
  let firstenum = true;
  let references = "";
  let allComment = "";
  let output = "";

  for (let i = 0; i < records.length; i++) {
    switch (records[i].Type) {
      case "entity":
        currentTable = records[i].Name;
        if (firsttable == true) {
          firsttable = false;
        } else {
          alltables += thistable + ");\n\n";
          thistable = "";
        }
        thistable += `CREATE TABLE ${records[i].Name} (\n`;
        allComment += `COMMENT ON TABLE ${currentTable} IS '${records[i].Description} ${records[i].Updates} ${records[i].Quantity}'; \n\n`;
        break;
      case "pk":
        thistable += "  Id SERIAL PRIMARY KEY,\n";
        break;
      case "fk":
        thistable += `  ${records[i].Name} int`;
        !records[i + 1] ||
        records[i + 1].Type == "entity" ||
        records[i + 1].Type == "enum"
          ? (thistable += "\n")
          : (thistable += ",\n");
        references += `ALTER TABLE ${currentTable} ADD FOREIGN KEY (${records[i].Name}) REFERENCES ${records[i].Description}(Id);\n\n`;
        break;
      case "ek":
        thistable += `  ${records[i].Name} ${records[i].Description},\n`;
        break;
      case "enum":
        if (firstenum == true) {
          firstenum = false;
        } else {
          allenums += `${thisenum});\n\n`;
          thisenum = "";
        }
        thisenum += `CREATE TYPE ${records[i].Name} AS ENUM (\n`;
        break;
      case "constant":
        thisenum += `  '${records[i].Name}'`;

        !records[i + 1] || records[i + 1].Type == "enum"
          ? (thisenum += "\n")
          : (thisenum += ",\n");
        break;
      default:
        thistable += `  ${records[i].Name} ${records[i].Type}`;

        !records[i + 1] ||
        records[i + 1].Type == "entity" ||
        records[i + 1].Type == "enum"
          ? (thistable += "\n")
          : (thistable += ",\n");

        allComment += `COMMENT ON COLUMN ${currentTable}.${records[i].Name} IS '${records[i].Description}; ${records[i].Size}'; \n\n`;
        break;
    }
  }

  allenums += `${thisenum});\n\n`;
  alltables += `${thistable});\n\n`;
  allComment += `\n\n`;

  output = `${allenums}${alltables}${references}${allComment}`;

  writeFile("sqlout.sql", output);
};

const createFiles = async (csv) => {
  const data = parse(csv, { columns: true });
  writeFile("data.csv", csv);
  writeSql(data);
  console.log("Completed");
};
module.exports = {
  createFiles
};
