"use strict";

const getTitleWithContentNodes = async (node, context, nodes = []) => {
  let nextNode;

  if (node.internal.type === "ContentfulTitleWithContent") {
    nodes.push(node);
  }

  if (node.type === "Section" && node.question___NODE) {
    nextNode = await context.nodeModel.getNodeById({
      id: node.question___NODE
    });
  }

  if (node.type === "Question" && node.answers___NODE) {
    const answers = await context.nodeModel.getNodesByIds({
      ids: node.answers___NODE
    });
    await Promise.all(
      answers.map((answer) => getTitleWithContentNodes(answer, context, nodes))
    );
  }

  if (node.type === "Answer" && node.nextStep___NODE) {
    nextNode = await context.nodeModel.getNodeById({
      id: node.nextStep___NODE
    });
  }

  // Ignore node.type === "Result" since it can't have noResult below it

  if (nextNode) {
    return getTitleWithContentNodes(nextNode, context, nodes);
  }

  return nodes;
};

module.exports = {
  noResultItems: {
    type: ["ContentfulTitleWithContent"],
    async resolve(source, args, context) {
      return getTitleWithContentNodes(source, context);
    }
  }
};
