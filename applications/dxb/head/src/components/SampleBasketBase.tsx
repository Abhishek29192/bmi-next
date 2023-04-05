import { graphql } from "gatsby";
import type { Data as FormData } from "./FormSection";
import type { Data as PageInfoData } from "./PageInfo";
import type { RichTextData } from "./RichText";

export type Data = {
  __typename: "SampleBasketSection";
  title?: string | null;
  description: RichTextData | null;
  checkoutFormSection: FormData | null;
  emptyBasketMessage: RichTextData | null;
  browseProductsCTALabel: string | null;
  browseProductsCTA: PageInfoData | null;
};

export const query = graphql`
  fragment SampleBasketSectionFragment on ContentfulSampleBasketSection {
    description {
      ...RichTextFragment
    }
    checkoutFormSection {
      ...FormSectionFragment
    }
    emptyBasketMessage {
      ...RichTextFragment
    }
    browseProductsCTALabel
    browseProductsCTA {
      ... on ContentfulHomePage {
        path
      }
      ... on ContentfulPage {
        path
      }
    }
  }
`;
