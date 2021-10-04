"use strict";

const bcrypt = require("bcrypt");

const saltRounds = 10;

async function main() {
  const plainTextPassword1 = "Super complex plain password";

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainTextPassword1, salt);

  console.log(`Password ready to be used in auth0: ${hash}`);
}

main();
