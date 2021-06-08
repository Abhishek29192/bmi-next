import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync
} from "fs";
import { execSync } from "child_process";
import { basename, join, normalize } from "path";
import { compile } from "json-schema-to-typescript";
import { dereference } from "@apidevtools/json-schema-ref-parser";
import { JSONSchema4 } from "json-schema";

type Properties = { [k: string]: JSONSchema4 };

let counter = 0;
const tempDir = mkdtempSync("generate-types-");
const gitRoot = join(tempDir, "glTF");
const schemas = join(tempDir, "schemas");
const typeDestination = normalize(
  "src/Visualiser/Functions/ThreeJsUtils/Gltf/types/"
);

const getSchemas = () => {
  execSync(`git clone git@github.com:KhronosGroup/glTF.git ${gitRoot}`, {
    stdio: "inherit"
  });
};

const getFiles = (path: string): string[] => {
  const files = readdirSync(path);
  return files.flatMap((file) => {
    const filePath = join(path, file);
    const status = statSync(filePath);
    if (status.isDirectory()) {
      return getFiles(filePath);
    } else if (file.endsWith(".schema.json")) {
      return [filePath];
    } else {
      return [];
    }
  });
};

const copySchemasToSingleLocation = () => {
  const files = [
    ...getFiles(join(gitRoot, "specification", "2.0")),
    ...getFiles(join(gitRoot, "extensions", "2.0"))
  ];
  mkdirSync(schemas);
  files.forEach((file) => {
    renameSync(file, join(schemas, basename(file)));
  });
};

const createTypes = async (schemaJson: string, schema: JSONSchema4) => {
  // eslint-disable-next-line no-console
  console.debug(schema);
  const ts = await compile(schema, schema.title!, {
    strictIndexSignatures: true
  });
  const typeFile = join(
    typeDestination,
    basename(schemaJson)?.replace(".schema.json", ".d.ts")
  );
  existsSync(typeFile) && unlinkSync(typeFile);
  writeFileSync(typeFile, ts);
  counter++;
};

const movePropertiesToAllOf = (properties: Properties) => {
  Object.keys(properties).forEach((key) => {
    const property = properties[key] as JSONSchema4;
    const items = property.items;
    if (!items) {
      return;
    }
    if (items.length > 1) {
      // eslint-disable-next-line no-console
      console.warn("Need to handle multiple items");
      return;
    }
    moveToAllOf(items as JSONSchema4);
  });
};

const moveToAllOf = (items: JSONSchema4) => {
  items.properties && movePropertiesToAllOf(items.properties);
  items.allOf = [...(items.allOf || []), { properties: items.properties }];
  // eslint-disable-next-line no-console
  console.debug(JSON.stringify(items, undefined, 2));
};

const convert = (schemaJson: string) => {
  dereference(schemaJson, (err, schema) => {
    if (err || !schema) {
      // eslint-disable-next-line no-console
      console.error(err);
      counter++;
    } else {
      moveToAllOf(schema as JSONSchema4);
      createTypes(schemaJson, schema as JSONSchema4);
    }
  });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const cleanUp = async (numberOfSchemas: number) => {
  while (counter !== numberOfSchemas) {
    await delay(1000);
  }

  rmdirSync(tempDir, { recursive: true });
};

getSchemas();
copySchemasToSingleLocation();
existsSync(typeDestination) || mkdirSync(typeDestination);
const schemaFiles = [
  "gltf.schema.json",
  "KHR_texture_transform.textureInfo.schema.json"
];
schemaFiles.forEach((schemaFile) => convert(join(schemas, schemaFile)));
cleanUp(schemaFiles.length);
