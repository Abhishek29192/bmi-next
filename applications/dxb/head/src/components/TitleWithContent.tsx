// Todo: somehow get the fragments from inside RichText???
import { graphql } from "gatsby";
import { RichTextData } from "../components/RichText";

export type Data = {
  __typename: "ContentfulTitleWithContent";
  name?: string;
  title: string | null;
  content: RichTextData | null;
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
