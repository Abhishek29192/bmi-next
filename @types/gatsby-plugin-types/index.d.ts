declare module "*gatsby-browser" {
  export const onInitialClientRender: import("gatsby").GatsbyBrowser["onInitialClientRender"];

  export const onRouteUpdate: import("gatsby").GatsbyBrowser["onRouteUpdate"];
}

declare module "*gatsby-ssr" {
  export const onRenderBody: import("gatsby").GatsbyNode["onRenderBody"];

  export const onRouteUpdate: import("gatsby").GatsbyBrowser["onRouteUpdate"];
}

declare module "*gatsby-node" {
  export const onPostBuild: import("gatsby").GatsbyNode["onPostBuild"];
  export const sourceNodes: import("gatsby").GatsbyNode["sourceNodes"];
}
