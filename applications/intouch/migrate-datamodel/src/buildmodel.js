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
    this.triggers = [];
    this.indices = [];
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

  addTrigger(trigger) {
    this.triggers.push(trigger);
  }

  addIndex(index) {
    this.indices.push(index);
  }

  getDefaultFunctions() {
    return `CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

`;
  }
}

class Value {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class Attribute extends Value {
  constructor(
    name,
    description,
    type,
    mockValues,
    constraint,
    reference,
    mandatory,
    defaultValue
  ) {
    super(name, description);
    this.type = type;
    this.mockValues = mockValues.split(";");
    this.constraint = constraint;
    this.reference = reference;
    this.defaultValue = defaultValue;

    // "Mandatory" field is optional, but if we get a value, must be a valid one.
    if (mandatory && !["Y", "N"].includes(mandatory)) {
      throw new Error(
        `Mandatory field valid values are [Y, N]. Found ${mandatory}.`
      );
    }
    this.mandatory = mandatory === "Y" ? true : false;
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
  constructor(name, description, examples, service, constraint) {
    super(name, description);
    this.examples = examples;
    this.service = service;
    this.constraint = constraint;
    this.additionalFields = [
      {
        name: "created_at",
        type: "timestamp NOT NULL DEFAULT now()"
      },
      {
        name: "updated_at",
        type: "timestamp NOT NULL DEFAULT now()"
      }
    ];
  }

  addColumn(
    name,
    description,
    type,
    mockValues,
    constraint,
    reference,
    mandatory,
    defaultValue
  ) {
    let attribute = new Attribute(
      name,
      description,
      type,
      mockValues,
      constraint,
      reference,
      mandatory,
      defaultValue
    );
    this.properties.push(attribute);
  }

  getPostgresCreate() {
    const additionalColumns = this.additionalFields.map(({ name, type }) => {
      return `${name} ${type}`;
    });

    return `DROP TABLE IF EXISTS ${this.name} CASCADE;
CREATE TABLE ${this.name} (
${this.properties
  .map((property) => {
    const isMandatory = property.mandatory ? "NOT NULL" : undefined;
    const type = property.type === "pk" ? "SERIAL PRIMARY KEY" : property.type;
    // NOTE: Currently only handling explicit default value
    const defaultValue = property.defaultValue
      ? `DEFAULT ${property.defaultValue}`
      : undefined;

    return [property.name, type, isMandatory, defaultValue]
      .filter(Boolean)
      .join(" ");
  })
  .concat(additionalColumns)
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
    return `${sqlString}\n`;
  }

  getSequence() {
    return `SELECT SETVAL('${this.name}_id_seq', (select MAX(ID) from ${this.name}));`;
  }

  getConstraints() {
    const singleConstraints = this.properties
      .filter((p) => p.constraint)
      .map((property) => {
        const refColumn = property.reference || property.name;

        return `ALTER TABLE ${this.name} ADD ${property.constraint} (${refColumn});\n`;
      });

    let multipleUniqueConstraints = [];
    if (this.constraint) {
      multipleUniqueConstraints = this.constraint
        .split("-")
        .map((item) => `ALTER TABLE ${this.name} ADD ${item};\n`);
    }
    return [].concat(singleConstraints, multipleUniqueConstraints).join("\n");
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
  constructor(source, referenceField, target, reference, service) {
    this.source = source;
    this.referenceField = referenceField;
    this.target = target;
    this.reference = reference;
    this.service = service;
  }

  getPostgresCreate() {
    const refColumn = this.reference || "id";
    return `ALTER TABLE ${this.source} ADD FOREIGN KEY (${this.referenceField}) REFERENCES ${this.target}(${refColumn}) ON DELETE CASCADE;
CREATE INDEX ON ${this.source} (${this.referenceField});`;
  }
}

class Trigger {
  constructor(source, service) {
    this.source = source;
    this.service = service;
  }

  getPostgresCreate() {
    return `CREATE TRIGGER set_${this.source}_updated_at 
BEFORE UPDATE ON ${this.source} 
FOR EACH ROW 
EXECUTE PROCEDURE update_modified_column();

`;
  }
}

class Index {
  constructor(table, columnName, indexType, service) {
    this.table = table;
    this.columnName = columnName;
    this.indexType = indexType;
    this.service = service;
  }

  getPostgresCreate() {
    return `CREATE INDEX  ${this.table}_${this.columnName}_idx ON ${this.table} USING ${this.indexType}(${this.columnName});\n`;
  }
}

const buildModel = (records) => {
  let myDataModel = new DataModel();

  let firstTable = true;
  let firstEnum = true;
  let myTable = new Table();
  let myEnum = new Enum();
  let myReference = new Reference();
  let trigger = new Trigger();
  let myIndex = new Index();

  records.forEach((record) => {
    switch (record.Type) {
      case "entity":
        if (firstTable == true) {
          firstTable = false;
        } else {
          myDataModel.addTable(myTable);
          myDataModel.addTrigger(trigger);
        }
        myTable = new Table(
          record.Name,
          record.Description,
          record.Examples,
          record.Service,
          record.Constraint
        );
        trigger = new Trigger(record.Name, record.Service);
        break;
      case "pk":
        myTable.addColumn(record.Name, record.Description, "pk", record.Mocks);
        break;
      case "fk": {
        const referenceType = record.ReferenceType
          ? record.ReferenceType
          : "int";
        myReference = new Reference(
          myTable.name,
          record.Name,
          record.Description,
          record.Reference,
          record.Service
        );
        myDataModel.addReference(myReference); // create a reference and add it to the list of references

        myTable.addColumn(record.Name, "fk", referenceType, record.Mocks); // add the new attribute to the current table
        break;
      }

      case "ek":
        if (record.Index) {
          // if the column needs indexing, add the Index to the list of indices in the datamodel
          myIndex = new Index(
            myTable.name,
            record.Name,
            record.Index,
            myTable.service
          );
          myDataModel.addIndex(myIndex);
        }
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
      case "ctd":
        break;
      case "ctdfield":
        break;
      default:
        if (record.Index) {
          // if the column needs indexing, add the Index to the list of indices in the datamodel
          myIndex = new Index(
            myTable.name,
            record.Name,
            record.Index,
            myTable.service
          );
          myDataModel.addIndex(myIndex);
        }
        myTable.addColumn(
          record.Name,
          record.Description,
          record.Type,
          record.Mocks,
          record.Constraint,
          record.Reference,
          record.Mandatory,
          record.Default
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
