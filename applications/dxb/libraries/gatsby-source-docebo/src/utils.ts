import { transformCourseCategory } from "@bmi/docebo-api";
import type { Course as DoceboCourse, Session } from "@bmi/docebo-types";
import { NodeBuilderInput, Course as TransformedCourse } from "./types";
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

export const transformCourse = ({
  category,
  price,
  ...rest
}: DoceboCourse & { sessions: Session[] }): TransformedCourse => ({
  categoryName: transformCourseCategory(category),
  price: price ? price.toString() : null,
  ...rest
});
