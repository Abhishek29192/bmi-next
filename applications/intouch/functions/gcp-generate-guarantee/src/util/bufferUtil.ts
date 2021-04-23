import { Buffer } from "buffer";
import axios, { AxiosResponse } from "axios";

export const buffer_encode = async (url: string): Promise<ArrayBuffer> => {
  const response: AxiosResponse<ArrayBuffer | Buffer> = await axios.get(url, {
    responseType: "arraybuffer"
  });

  return response.data;
};

export const toArrayBuffer = async (buffer: Buffer): Promise<ArrayBuffer> => {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
};
