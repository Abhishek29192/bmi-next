import { enc, MD5 } from "crypto-js";
import MurmurHash3 from "imurmurhash";

export const generateHashFromString = (
  str: string,
  useDate?: boolean
): string => {
  const dateString = useDate ? new Date().getTime().toString() : "";

  return MurmurHash3(str + dateString)
    .result()
    .toString();
};

export const generateDigestFromData = (data: unknown): string =>
  MD5(JSON.stringify(data)).toString(enc.Hex);
