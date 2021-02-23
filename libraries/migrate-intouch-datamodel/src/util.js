#!/usr/bin/env node
"use strict";

/* 
This code block is taken from the @kimnobaydd
https://gist.github.com/kimnobaydd/70b8c9fe6ccd21733c8dbd3abad22b49
*/

const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const { buildModel } = require("./buildmodel");

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

const writeSql = (dataModel, service) => {
  let output = "";

  dataModel.enums
    .filter((item) => item.service === service)
    .forEach((dropdown) => {
      output += dropdown.getPostgresCreate();
    });
  output += "\n\n";

  const tables = dataModel.tables.filter((item) => item.service === service);

  tables.forEach((table) => {
    output += table.getPostgresCreate();
    output += "\n\n";
  });

  tables.forEach((table) => {
    output += table.getPostgresInsert();
  });

  const references = dataModel.references.filter((item) => {
    const sourceTables = tables.filter((x) => x.name === item.source);
    const refTables = tables.filter((x) => x.name === item.target);
    return sourceTables.length > 0 && refTables.length > 0;
  });
  references.forEach((reference) => {
    output += reference.getPostgresCreate();
    output += "\n\n";
  });

  tables.forEach((table) => {
    output += table.getPostgresComment();
    output += "\n\n";
  });
  writeFile(`${service.toLowerCase()}.sql`, output);
};

const createFiles = async (csv) => {
  const data = parse(csv, { columns: true });
  writeFile("data.csv", csv);
  let myDataModel = buildModel(data);

  myDataModel.services.forEach((service) => {
    writeSql(myDataModel, service);
  });

  console.log("Completed");
};

module.exports = {
  createFiles
};
