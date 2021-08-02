declare module "graphql-upload" {
  import { ReadStream } from "fs-capacitor";

  export { GraphQLUpload, graphqlUploadExpress } from "graphql-upload";

  export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream(): ReadStream;
  }
}
