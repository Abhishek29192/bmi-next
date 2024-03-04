import { transformCourseCategory } from "@bmi/docebo-api";
import type { CurrencyFields } from "@bmi/docebo-api";
import type {
  Course as DoceboCourse,
  Session as DoceboSession
} from "@bmi/docebo-types";
import type { NodeInput, SourceNodesArgs } from "gatsby";
import type {
  NodeBuilderInput,
  Course as TransfomedCourse,
  Session as TransformedSession
} from "./types";

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
    sessions: TransformedSession[];
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

export const transformSessions = (
  sessions: DoceboSession[]
): TransformedSession[] => {
  const currentDate = new Date();
  const timeZoneOffset = currentDate.getTimezoneOffset();

  return sessions
    .map(({ date_end, date_start, ...rest }) => {
      const sessionStartTime = date_start ? new Date(date_start) : undefined;
      if (sessionStartTime) {
        sessionStartTime.setTime(
          //timeZoneOffset * 60000 - converts minutes into milliseconds
          sessionStartTime.getTime() - timeZoneOffset * 60000
        );
      }

      const sessionEndTime = date_end ? new Date(date_end) : undefined;
      if (sessionEndTime) {
        sessionEndTime.setTime(
          //timeZoneOffset * 60000 - converts minutes into milliseconds
          sessionEndTime.getTime() - timeZoneOffset * 60000
        );
      }

      return {
        ...rest,
        date_end: sessionEndTime?.getTime(),
        date_start: sessionStartTime?.getTime()
      };
    })
    .filter((session) => {
      return session.date_start && session.date_start > currentDate.getTime();
    });
};
