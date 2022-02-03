import * as fs from "fs";
import * as path from "path";

const folder = `${path.resolve(__dirname)}/fonts`;

const create = () => {
  const vfs = {};

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const fileNames = fs.readdirSync(folder);
  fileNames.forEach((fileName) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const base64Data = fs.readFileSync(`${folder}/${fileName}`, {
      encoding: "base64"
    });
    // eslint-disable-next-line security/detect-object-injection
    vfs[fileName] = base64Data;
  });

  const file = `export const vfs =${JSON.stringify(vfs)}`;
  fs.writeFile("fonts.ts", file, function (error) {
    if (error) throw error;
    // eslint-disable-next-line no-console
    console.log("Doc saved!");
  });
};

create();
