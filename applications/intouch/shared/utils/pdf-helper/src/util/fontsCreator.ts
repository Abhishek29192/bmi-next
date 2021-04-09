import * as fs from "fs";
import * as path from "path";

const folder: string = `${path.resolve(__dirname)}/fonts`;

const create = () => {
  let vfs = {};

  const fileNames = fs.readdirSync(folder);
  fileNames.forEach((fileName) => {
    const base64Data = fs.readFileSync(`${folder}/${fileName}`, {
      encoding: "base64"
    });
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
