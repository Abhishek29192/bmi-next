import { transformCourseCategory } from "@bmi/docebo-api";
import type { CurrencyFields } from "@bmi/docebo-api";
import type { Course as DoceboCourse, Session } from "@bmi/docebo-types";
import type { NodeBuilderInput, Course as TransfomedCourse } from "./types";
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

type TransformCourseProps = DoceboCourse &
  CurrencyFields & {
    sessions: Session[];
  };

export const transformCourse = ({
  category,
  currency_currency,
  currency_symbol,
  ...rest
}: TransformCourseProps): TransfomedCourse => ({
  categoryName: transformCourseCategory(category),
  currency: currency_currency,
  currencySymbol: currency_symbol,
  ...rest
});
