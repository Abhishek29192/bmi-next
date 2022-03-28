import { Context, Node, ResolveArgs } from "./types";

export default {
  regions: {
    type: ["RegionJson"],
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      return await context.nodeModel.getAllNodes(
        { type: "RegionJson" },
        { connectionType: "RegionJson" }
      );
    }
  }
};
