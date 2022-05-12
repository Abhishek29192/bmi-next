// Todo: somehow get the fragments from inside RichText???
import { graphql } from "gatsby";
import { RichTextData } from "./RichText";
import { Data as LinkData } from "./Link";

export type Data = {
  __typename: "ContentfulSpecificationNotesWithCta";
  name: string;
  title: string | null;
  description: RichTextData | null;
  cta: LinkData | null;
};

export const query = graphql`
  fragment SpecificationNotesFragment on ContentfulSpecificationNotesWithCta {
    __typename
    title
    name
    description {
      ...RichTextFragment
    }
    cta {
      ...LinkFragment
    }
  }
`;
