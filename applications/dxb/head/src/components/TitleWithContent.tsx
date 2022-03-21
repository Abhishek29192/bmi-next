// Todo: somehow get the fragments from inside RichText???
import { graphql } from "gatsby";
import { RichTextData } from "./RichText";

export type Data = {
  __typename: "ContentfulTitleWithContent";
  name: string;
  title: string | null;
  content: RichTextData;
};

export const query = graphql`
  fragment TitleWithContentFragment on ContentfulTitleWithContent {
    __typename
    title
    name
    content {
      ...RichTextFragment
    }
  }
`;
