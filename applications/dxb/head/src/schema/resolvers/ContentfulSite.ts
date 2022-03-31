import { Context, Node, ResolveArgs } from "./types";

export default {
  regions: {
    type: ["RegionJson"],
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<Node[]> {
      const { entries } = await context.nodeModel.findAll<Node>(
        { query: {}, type: "RegionJson" },
        { connectionType: "RegionJson" }
      );
      return [...entries];
    }
  }
};
