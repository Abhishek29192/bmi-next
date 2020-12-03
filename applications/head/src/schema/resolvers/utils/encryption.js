"use strict";

const crypto = require("crypto");
const MurmurHash3 = require("imurmurhash");

exports.generateIdFromString = (string) =>
  MurmurHash3(string + new Date().getTime().toString)
    .result()
    .toString();

exports.generateDigestFromData = (data) =>
  crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
