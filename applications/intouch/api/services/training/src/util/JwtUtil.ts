import { readFileSync } from "fs";
import * as path from "path";
import * as jwt from "jsonwebtoken";

const { DOCEBO_API_JWT_PASSPHRASE } = process.env;

//TODO:Fix
const PRIVATE_KEY_FILE = path.resolve(__dirname, "../../jwtRS256.key");
const createToken = async (payload: any) => {
  const privateKey = readFileSync(PRIVATE_KEY_FILE, "utf-8");
  return jwt.sign(
    payload,
    { key: privateKey, passphrase: DOCEBO_API_JWT_PASSPHRASE },
    { algorithm: "RS256" }
  );
};

export { createToken };
