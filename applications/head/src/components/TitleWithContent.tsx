import { Document } from "@contentful/rich-text-types";
import { graphql } from "gatsby";

export type Data = {
  __typename: "ContentfulTitleWithContent";
  title: string;
  content: {
    json: Document;
  };
};

export const query = graphql`
  fragment TitleWithContentFragment on ContentfulTitleWithContent {
    __typename
    title
    content {
      json
    }
  }
`;
