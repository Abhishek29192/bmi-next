import { Context, Node, ResolveArgs } from "./types";

export default {
  services: {
    type: ["ContentfulService"],
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      const services = (await context.nodeModel.findAll(
        {
          query: {
            filter: { entryType: { eq: source.type } }
          },
          type: "ContentfulService",
          firstOnly: false
        },
        { connectionType: "ContentfulService" }
      )) as Node[];
      if (!services || !services.length) {
        return [];
      }
      return services;
    }
  }
};
