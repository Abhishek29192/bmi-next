import { Document } from "@contentful/rich-text-types";
import { graphql } from "gatsby";

export type Data = {
  title: string;
  content: {
    json: Document;
  };
};

export const query = graphql`
  fragment TitleWithContentFragment on ContentfulTitleWithContent {
    title
    content {
      json
    }
  }
`;
