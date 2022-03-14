declare module "*gatsby-node" {
  export const onPostBuild: import("gatsby").GatsbyNode["onPostBuild"];
}

declare module "*getMetaRedirect" {
  export default (toPath: string, isPermanent?: boolean) => string;
}
