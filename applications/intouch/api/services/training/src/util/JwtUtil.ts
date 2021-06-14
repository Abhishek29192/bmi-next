import * as jwt from "jsonwebtoken";

const { DOCEBO_API_JWT_PASSPHRASE, DOCEBO_JWT_KEY } = process.env;

//TODO:Fix
const createToken = async (payload: any) => {
  return jwt.sign(
    payload,
    { key: DOCEBO_JWT_KEY, passphrase: DOCEBO_API_JWT_PASSPHRASE },
    { algorithm: "RS256" }
  );
};

export { createToken };
