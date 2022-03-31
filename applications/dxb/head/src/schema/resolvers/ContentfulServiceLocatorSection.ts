import { Context, Node, ResolveArgs } from "./types";

export default {
  services: {
    type: ["ContentfulService"],
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<Node[]> {
      const { entries } = await context.nodeModel.findAll<Node>(
        {
          query: {
            filter: { entryType: { eq: source.type } }
          },
          type: "ContentfulService"
        },
        { connectionType: "ContentfulService" }
      );
      const services = [...entries];
      if (!services || !services.length) {
        return [];
      }
      return services;
    }
  }
};
