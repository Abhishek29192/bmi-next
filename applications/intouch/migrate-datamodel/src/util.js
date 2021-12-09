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

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!fs.existsSync(dir)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.mkdirSync(dir);
  }
  const path = `${dir}/${fileName}`;
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFile(path, data, function (err) {
    if (err) return console.log(err);
  });
};

const writeSql = (dataModel, service) => {
  let output = "";
  let outputContraint = "";
  let outputData = "";

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
    outputData += table.getPostgresInsert();
    outputContraint += table.getConstraints();
  });
  const references = dataModel.references.filter((item) => {
    const sourceTables = tables.filter((x) => x.name === item.source);
    const refTables = tables.filter((x) => x.name === item.target);
    return sourceTables.length > 0 && refTables.length > 0;
  });
  references.forEach((reference) => {
    outputContraint += reference.getPostgresCreate();
    outputContraint += "\n\n";
  });

  tables.forEach((table) => {
    output += table.getPostgresComment();
    output += "\n\n";
  });

  tables.forEach((table) => {
    outputData += table.getSequence();
    outputData += "\n";
  });
  output += "\n";
  output += dataModel.getDefaultFunctions();

  dataModel.triggers
    .filter((item) => item.service === service)
    .forEach((dropdown) => {
      output += dropdown.getPostgresCreate();
    });
  //output += "\n\n";

  dataModel.indices
    .filter((item) => item.service === service)
    .forEach((index) => {
      output += index.getPostgresCreate();
      output += "\n\n";
    });

  writeFile(`${service.toLowerCase()}.sql`, output);
  if (outputData.length > 0) {
    writeFile(`${service.toLowerCase()}.data.sql`, outputData);
  }
  if (outputContraint.length > 0) {
    writeFile(`${service.toLowerCase()}.contraints.sql`, outputContraint);
  }
};

const createFiles = async (csv) => {
  const data = parse(csv, { columns: true, trim: true });
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
