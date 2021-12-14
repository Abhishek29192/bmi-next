import { fromStream } from "file-type";
import { FileUpload } from "graphql-upload";

const validFileTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/bmp"
];

export const filesTypeValidate = async (files: any[]) => {
  for (let i = 0; i < files?.length; i++) {
    const file: FileUpload = await files[+i];
    const stream = file.createReadStream();
    const type = await fromStream(stream);
    if (!type) {
      throw new Error("Invalid file type");
    }
    if (!validFileTypes.includes(type.mime)) {
      throw new Error(`${file.filename} not allowed`);
    }
  }
  return true;
};
