import { NodeBuilderInput } from "./types";
import type { SourceNodesArgs, NodeInput } from "gatsby";

export interface Props {
  gatsbyApi: SourceNodesArgs;
  input: NodeBuilderInput;
  itemId: string | number;
}

export const nodeBuilder = ({ gatsbyApi, input, itemId }: Props) => {
  const id = gatsbyApi.createNodeId(`${input.type}-${itemId}`);

  const node: NodeInput = {
    ...input.data,
    id,
    parent: null,
    children: [],
    internal: {
      type: input.type,
      contentDigest: gatsbyApi.createContentDigest(input.data)
    }
  };

  gatsbyApi.actions.createNode(node);
};
