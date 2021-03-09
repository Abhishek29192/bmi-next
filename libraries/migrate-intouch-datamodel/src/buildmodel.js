#!/usr/bin/env node
"use strict";

/* 
This code block is taken from the @kimnobaydd
https://gist.github.com/kimnobaydd/70b8c9fe6ccd21733c8dbd3abad22b49

This script is for prototyping phase only.
*/

class DataModel {
  constructor() {
    this.tables = [];
    this.enums = [];
    this.references = [];
    this.services = [];
  }

  addTable(table) {
    this.tables.push(table);
  }

  addEnum(dropdown) {
    this.enums.push(dropdown);
  }

  addReference(reference) {
    this.references.push(reference);
  }

  addServices(services) {
    this.services = services;
  }
}

class Value {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class Attribute extends Value {
  constructor(name, description, type, mockValues) {
    super(name, description);
    this.type = type;
    this.mockValues = mockValues.split(";");
  }
}

class Thing {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.properties = [];
  }
}

class Table extends Thing {
  constructor(name, description, examples, service) {
    super(name, description);
    this.examples = examples;
    this.service = service;
  }

  addColumn(name, description, type, mockValues) {
    let attribute = new Attribute(name, description, type, mockValues);
    this.properties.push(attribute);
  }

  getPostgresCreate() {
    return `DROP TABLE IF EXISTS ${this.name} CASCADE;
CREATE TABLE ${this.name} (
${this.properties
  .map((property) => {
    const column =
      property.type === "pk"
        ? `${property.name} SERIAL PRIMARY KEY`
        : `${property.name} ${property.type}`;
    return column;
  })
  .join(",\n")
  .concat(`\n);`)}`;
  }

  getPostgresComment() {
    const columnsComment = this.properties
      .map(
        (property) =>
          `COMMENT ON COLUMN ${this.name}.${property.name} IS '${property.description}';`
      )
      .join("\n");

    return `COMMENT ON TABLE ${this.name} IS '${this.description}';\n${columnsComment}`;
  }

  getPostgresInsert() {
    let sqlString = `\nTRUNCATE TABLE ${this.name} RESTART IDENTITY;\n`;

    const columns = this.properties.map((property) => property.name).join();
    for (let j = 0; j < this.examples; j++) {
      const values = this.properties
        .map((property) => {
          const mockValue = property.mockValues[+j]
            ? property.mockValues[+j]
            : "";

          return mockValue == ""
            ? "null"
            : ["boolean", "int", "real"].some((type) => type === property.type)
            ? mockValue
            : `'${mockValue}'`;
        })
        .join();
      sqlString += `INSERT INTO ${this.name}(${columns})\nVALUES (${values});\n`;
    }
    return sqlString;
  }
}

class Enum extends Thing {
  constructor(name, description, service) {
    super(name, description);
    this.service = service;
  }

  addValue(name, description) {
    let value = new Value(name, description);
    this.properties.push(value);
  }

  getPostgresCreate() {
    return `
DROP TYPE IF EXISTS ${this.name} CASCADE;
CREATE TYPE ${this.name}  AS ENUM (
${this.properties
  .map((property) => {
    return `'${property.name}'`;
  })
  .join(",\n")
  .concat(`\n);`)}  
  `;
  }
}

class Reference {
  constructor(source, referenceField, target, service) {
    this.source = source;
    this.referenceField = referenceField;
    this.target = target;
    this.service = service;
  }

  getPostgresCreate() {
    return `ALTER TABLE ${this.source} ADD FOREIGN KEY (${this.referenceField}) REFERENCES ${this.target}(Id);`;
  }
}
const buildModel = (records) => {
  let myDataModel = new DataModel();

  let firstTable = true;
  let firstEnum = true;
  let myTable = new Table();
  let myEnum = new Enum();
  let myReference = new Reference();

  records.forEach((record) => {
    switch (record.Type) {
      case "entity":
        if (firstTable == true) {
          firstTable = false;
        } else {
          myDataModel.addTable(myTable);
        }
        myTable = new Table(
          record.Name,
          record.Description,
          record.Examples,
          record.Service
        );
        break;
      case "pk":
        myTable.addColumn(record.Name, record.Description, "pk", record.Mocks);
        break;
      case "fk":
        myReference = new Reference(
          myTable.name,
          record.Name,
          record.Description,
          record.Service
        );
        myDataModel.addReference(myReference); // create a reference and add it to the list of references
        myTable.addColumn(record.Name, "fk", "int", record.Mocks); // add the new attribute to the current table
        break;
      case "ek":
        myTable.addColumn(record.Name, "ek", record.Description, record.Mocks); // add the new attribute to the current table. The description column in the csv in this case contains a type rather than a description
        break;
      case "enum":
        if (firstEnum == true) {
          myDataModel.addTable(myTable); // we are at the first enum so have to add the last table to the list
          firstEnum = false;
        } else {
          myDataModel.addEnum(myEnum); // add the last enum to the list of enums
        }
        myEnum = new Enum(record.Name, record.Description, record.Service); // create a new enum based on the current record
        break;
      case "constant":
        myEnum.addValue(record.Name, record.Description); // add the value to the current enum based on the current record. todo modify constructor to not require 4 arguments
        break;
      default:
        myTable.addColumn(
          record.Name,
          record.Description,
          record.Type,
          record.Mocks
        ); // add the new field to the current table based on the current record
        break;
    }
  });
  myDataModel.addEnum(myEnum); // add the final enum to the list of enums

  const services = [
    ...new Set([
      ...myDataModel.tables.map((item) => item.service),
      ...myDataModel.enums.map((item) => item.service)
    ])
  ];
  myDataModel.addServices(services);

  return myDataModel;
};

module.exports = {
  buildModel
};
