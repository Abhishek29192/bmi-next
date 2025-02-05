import type { Context, Node, ResolveArgs } from "./types/Gatsby";

const getTitleWithContentNodes = async (
  node: Node,
  context: Context,
  nodes: Partial<Node>[] = []
) => {
  let nextNode;

  if (node.internal.type === "ContentfulTitleWithContent") {
    nodes.push(node);
  }

  if (
    node.__typename === "ContentfulSystemConfiguratorSection" &&
    node.question___NODE
  ) {
    nextNode = await context.nodeModel.getNodeById({
      id: node.question___NODE
    });
  }

  if (
    node.__typename === "ContentfulSystemConfiguratorQuestion" &&
    node.answers___NODE
  ) {
    const answers = await context.nodeModel.getNodesByIds({
      ids: node.answers___NODE
    });
    await Promise.all(
      answers.map((answer) => getTitleWithContentNodes(answer, context, nodes))
    );
  }

  if (
    node.__typename === "ContentfulSystemConfiguratorAnswer" &&
    node.nextStep___NODE
  ) {
    nextNode = await context.nodeModel.getNodeById({
      id: node.nextStep___NODE
    });
  }

  // Ignore node.__typename === "ContentfulSystemConfiguratorResult" since it can't have noResult below it

  if (nextNode) {
    return getTitleWithContentNodes(nextNode, context, nodes);
  }

  return nodes;
};

export default {
  noResultItems: {
    type: ["ContentfulTitleWithContent"],
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      return getTitleWithContentNodes(source, context);
    }
  }
};
