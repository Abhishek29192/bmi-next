"use strict";

const fs = require("fs");
const findInFiles = require("find-in-files");
const jsonfile = require("jsonfile");
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

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!fs.existsSync(path)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.mkdirSync(path, { recursive: true });
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  jsonfile.writeFileSync(`${path}/${filename}`, { keys });
});
