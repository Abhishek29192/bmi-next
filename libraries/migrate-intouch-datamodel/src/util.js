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

const writeSql = (dataModel) => {
  let output = "";

  dataModel.enums.forEach((dropdown) => {
    output += dropdown.getPostgresCreate();
  });
  output += "\n\n";

  dataModel.tables.forEach((table) => {
    output += table.getPostgresCreate();
    output += "\n\n";
  });

  /* TODO:There are problems mockdata*/
  dataModel.tables.forEach((table) => {
    output += table.getPostgresInsert();
  });

  dataModel.references.forEach((reference) => {
    output += reference.getPostgresCreate();
    output += "\n\n";
  });

  dataModel.tables.forEach((table) => {
    output += table.getPostgresComment();
    output += "\n\n";
  });
  writeFile("sqlout.sql", output);
};

const createFiles = async (csv) => {
  const data = parse(csv, { columns: true });
  writeFile("data.csv", csv);
  let myDataModel = buildModel(data);
  writeSql(myDataModel);
  console.log("Completed");
};

module.exports = {
  createFiles
};
