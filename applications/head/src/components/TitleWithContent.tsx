// Todo: somehow get the fragments from inside RichText???
import { RichTextData } from "../components/RichText";
import { graphql } from "gatsby";

export type Data = {
  __typename: "ContentfulTitleWithContent";
  title: string;
  content: RichTextData | null;
};

export const query = graphql`
  fragment TitleWithContentFragment on ContentfulTitleWithContent {
    __typename
    title
    content {
      ...RichTextFragment
    }
  }
`;
