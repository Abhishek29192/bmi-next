import { Buffer } from "buffer";
import axios from "axios";

export const base64_encode = async (url: string) => {
  let image = await axios.get(url, { responseType: "arraybuffer" });
  let raw = Buffer.from(image.data, "binary").toString("base64");
  return `data:image/jpeg;base64,${raw}`;
};
