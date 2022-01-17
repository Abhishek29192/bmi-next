import { Buffer } from "buffer";
import axios from "axios";

export const base64_encode = async (url: string) => {
  const image = await axios.get(url, { responseType: "arraybuffer" });
  const raw = Buffer.from(image.data, "binary").toString("base64");
  return `data:image/jpeg;base64,${raw}`;
};
