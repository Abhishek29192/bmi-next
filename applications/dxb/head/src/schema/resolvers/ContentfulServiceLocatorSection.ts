import { Context, Node, ResolveArgs } from "./types";

export default {
  services: {
    type: ["ContentfulService"],
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      return context.nodeModel.runQuery(
        {
          query: {
            filter: { entryType: { eq: source.type } }
          },
          type: "ContentfulService",
          firstOnly: false
        },
        { connectionType: "ContentfulService" }
      );
    }
  }
};
