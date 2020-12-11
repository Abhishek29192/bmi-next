"use strict";

const findInFiles = require("find-in-files");
const jsonfile = require("jsonfile");
const fs = require("fs");
const _ = require("lodash");

const pattern = /getMicroCopy\("([A-z.]+)"\)/;
const path = "./.temp";
const filename = "microCopyKeys.json";

findInFiles.find(pattern, "./src").then((results) => {
  const keys = _.uniq(
    Object.values(results)
      .map(({ matches }) =>
        matches.map((match) => match.replace(pattern, "$1"))
      )
      .flat()
      .sort()
  );

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  jsonfile.writeFileSync(`${path}/${filename}`, { keys });
});
