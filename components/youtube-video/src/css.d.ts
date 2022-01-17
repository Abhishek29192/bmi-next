// import * as CSS from "csstype";
declare module "csstype" {
  interface Properties {
    // Add a CSS Custom Property
    "--aspect-ratio"?: number;
  }
}
