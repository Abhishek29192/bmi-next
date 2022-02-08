declare module "*gatsby-node" {
  export const onPostBuild: (
    { graphql },
    {
      node: unknown,
      apiKey: string,
      auth: unknown,
      queries: unknown,
      chunkSize: number = 1000
    }
  ) => void;
}
