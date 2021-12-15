"use strict";

// Experimental migration script for BMI InTouch legacy data. kim@nobay.co.uk May 2021.
// Requires 4 csv files (accounts.csv, companies.csv, members.csv, addresses.csv) in the same directory as from where the script is run
// Generates a file called importme.sql for importing the data into Intouch database

// TODO make 'today' a variable based on the date that the script is run
// TODO retrieve the market_id from the command line arguments
// TODO generate a new BMI reference (roofpro memebership number)for migrated companies or migrate the old one
// TODO migrate the logo image rather than the address of the image
// TODO migrate the building owner details for each company
// TODO remove trailing and leading spaces from input data
// TODO insert any other fields that can be easily generated, e.g. created by
// TOTO update the script to insert the region field in addresses

let path = require("path");
let fs = require("fs").promises;
let parse = require("csv-parse/lib/sync");

const MARKET_ID = 2; // must be the right Market ID, or you will end up with people imported into the wrong market
const today = "2021-05-12 10:19:47"; // will be imported into the 'created' column in postgres

// function to clean input data.
function cleanInput(record) {
  for (const property in record) {
    // eslint-disable-next-line security/detect-object-injection
    record[property] = record[property].replace(/'/g, "''"); // replace any single apostrophes with repeated apostrophes to make Postgres happy
  }
  return record;
}

let sqlStatement;

const writeSql = (accounts, companies, members, addresses, owners) => {
  // Generate SQL for importing the accounts data including the migration id for each record

  let output =
    "select setval('account_id_seq', (select max(id) from account));\n\n"; // make the next default primary key inserted the next sequential one available in the table

  accounts.forEach((account) => {
    account = cleanInput(account);
    sqlStatement =
      "INSERT INTO account(market_id, status, role, email, phone, first_name, last_name, created, docebo_user_id, docebo_username, migration_id) VALUES (" +
      MARKET_ID +
      ", 'NEW', '" +
      account.role +
      "'" +
      ", '" +
      account.email +
      "', '" +
      account.phone +
      "', '" +
      account.first_name +
      "', '" +
      account.last_name +
      "', '" +
      today +
      "', " +
      (account.docebo_id ? account.docebo_id : "DEFAULT") +
      ", '" +
      account.email +
      "', '" +
      account.migration_id +
      "');";
    output += sqlStatement;
    output += "\n";
  });

  // Generate SQL for importing the companies data including the migration id for each record

  output +=
    "\nselect setval('company_id_seq', (select max(id) from company));\n\n"; // make the next default primary key inserted the next sequential one available in the table

  companies.forEach((company) => {
    company = cleanInput(company);
    sqlStatement =
      "INSERT INTO company(market_id, migration_id, name, tier, status, tax_number, about_us, logo, phone, public_email, registered_address_migration_id, trading_address_migration_id, website, linked_in) VALUES (" +
      MARKET_ID +
      ", '" +
      company.migration_id +
      "', '" +
      company.name +
      "', '" +
      company.tier +
      "', " +
      "'ACTIVE'," +
      "'" +
      company.tax_number +
      "', '" +
      company.about_us +
      "', '" +
      company.logo +
      "', '" +
      company.phone +
      "', '" +
      company.public_email +
      "', '" +
      company.registered_address_migration_id +
      "', '" +
      company.trading_address_migration_id +
      "', '" +
      company.website +
      "', '" +
      company.linked_in +
      "');";
    output += sqlStatement;
    output += "\n";
  });

  // Generate SQL for inserting the company membership data by cross refrencing the migration ids in the import file with those that have been brought in for new accounts and companies

  output +=
    "\nselect setval('company_member_id_seq', (select max(id) from company_member));\n\n"; // make the next default primary key inserted the next sequential one available in the table

  members.forEach((member) => {
    sqlStatement =
      "INSERT INTO company_member(market_id, company_id, account_id) VALUES (" +
      MARKET_ID +
      ", (SELECT id from company where migration_id='" +
      member.company_migration_id +
      "'), (SELECT id from account where migration_id='" +
      member.account_migration_id +
      "'));";
    output += sqlStatement;
    output += "\n";
  });

  output +=
    "\nselect setval('address_id_seq', (select max(id) from address));\n\n"; // make the next default primary key inserted the next sequential one available in the table

  // Generate SQL for iserting the new address data along with the migration ids.

  addresses.forEach((address) => {
    address = cleanInput(address);
    sqlStatement =
      "INSERT INTO address(migration_id, first_line, second_line, town, country, postcode, coordinates) VALUES ('" +
      address.migration_id +
      "', '" +
      address.first_line +
      "', '" +
      address.second_line +
      "', '" +
      address.town +
      "', '" +
      address.country +
      "', '" +
      address.postcode +
      "', " +
      (address.coordinates ? "'" + address.coordinates + "'" : "NULL") +
      ");";
    output += sqlStatement;
    output += "\n";
  });

  output += "\n\n";

  // Generate the SQL to update all the new companies withe their related new address by cross referencing the migration ids of the new companies and addresses

  companies.forEach((company) => {
    sqlStatement =
      "UPDATE company SET registered_address_id = " +
      "(SELECT id FROM address WHERE migration_id = '" +
      company.registered_address_migration_id +
      "') " +
      "WHERE id = (SELECT id FROM company WHERE migration_id = '" +
      company.migration_id +
      "');\n";
    sqlStatement +=
      "UPDATE company SET trading_address_id = " +
      "(SELECT id FROM address WHERE migration_id = '" +
      company.trading_address_migration_id +
      "') " +
      "WHERE id = (SELECT id FROM company WHERE migration_id = '" +
      company.migration_id +
      "');\n";
    output += sqlStatement;
    output += "\n";
  });

  // Generate the SQL to update all the new companies withe their related new owner details by cross referencing the migration ids of the new companies and owners

  owners.forEach((owner) => {
    owner = cleanInput(owner);
    sqlStatement =
      "UPDATE company SET owner_fullname = '" +
      owner.fullname +
      "' WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = '" +
      owner.migration_id +
      "');\n";
    sqlStatement +=
      "UPDATE company SET owner_email = '" +
      owner.email +
      "' WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = '" +
      owner.migration_id +
      "');\n";
    sqlStatement +=
      "UPDATE company SET owner_phone = '" +
      owner.phone +
      "' WHERE id = (SELECT company.id FROM company INNER JOIN company_member on company.id = company_member.company_id INNER JOIN account on company_member.account_id = account.id WHERE account.migration_id = '" +
      owner.migration_id +
      "');\n";
    output += sqlStatement;
    output += "\n";
  });

  // Put all the SQL generated in a text file for someone or something to run on the InTouch database.

  fs.writeFile("importme.sql", output, function (err) {
    if (err) return console.log(err);
  });
};

const getData = async (writeSqlOut) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const accountsFileContent = await fs.readFile(
    path.resolve(__dirname + "/data/accounts.csv")
  );
  const accountsData = parse(accountsFileContent, { columns: true });

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const companiesFileContent = await fs.readFile(
    path.resolve(__dirname + "/data/companies.csv")
  );
  const companiesData = parse(companiesFileContent, { columns: true });

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const membersFileContent = await fs.readFile(
    path.resolve(__dirname + "/data/members.csv")
  );
  const membersData = parse(membersFileContent, { columns: true });

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const addressesFileContent = await fs.readFile(
    path.resolve(__dirname + "/data/addresses.csv")
  );
  const addressesData = parse(addressesFileContent, { columns: true });

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const ownersFileContent = await fs.readFile(
    path.resolve(__dirname + "/data/owners.csv")
  );
  const ownersData = parse(ownersFileContent, { columns: true });

  // let myDataModel = build(accountsData);
  writeSqlOut(
    accountsData,
    companiesData,
    membersData,
    addressesData,
    ownersData
  );
};

getData(writeSql);
