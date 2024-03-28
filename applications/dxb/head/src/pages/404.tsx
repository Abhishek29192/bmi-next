import Button from "@bmi-digital/components/button";
import PromoSection from "@bmi-digital/components/promo-section";
import Typography from "@bmi-digital/components/typography";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import FallbackComponent from "../components/FallbackComponent";
import Image from "../components/Image";
import { getClickableActionFromUrl } from "../components/Link";
import Page from "../components/Page";
import Video from "../components/Video";
import { FourOFourResponse } from "../schema/resolvers/types/Contentful";

type Data = {
  fourOFour: FourOFourResponse;
};

const FourOFour = ({ data }: { data: Data }) => {
  const siteData = data.fourOFour.siteData;
  const errorFourOFour = data.fourOFour.errorPageData;
  const placeholderTitle = "Error:404.title";
  const placeholderSubtitle = "Error:404.subtitle";
  const placeholderCTALabel = "Error:404.cta.label";
  const memoizedGetClickableActionFromUrl = useMemo(
    () =>
      getClickableActionFromUrl({
        linkedPage: errorFourOFour?.cta?.linkedPage,
        url: errorFourOFour?.cta?.url,
        countryCode: siteData?.countryCode,
        label: errorFourOFour?.cta?.label || placeholderCTALabel
      }),
    [errorFourOFour, siteData, placeholderCTALabel]
  );
  {
    return siteData && errorFourOFour ? (
      <Page
        title={errorFourOFour.title || placeholderTitle}
        pageData={{
          breadcrumbs: null,
          signupBlock: null,
          seo: null,
          path: null
        }}
        siteData={siteData}
      >
        <PromoSection
          title={errorFourOFour.title || placeholderTitle}
          media={
            errorFourOFour.featuredVideo ? (
              <Video {...errorFourOFour.featuredVideo} />
            ) : errorFourOFour.featuredMedia ? (
              <Image {...errorFourOFour.featuredMedia} />
            ) : undefined
          }
        >
          <Typography variant="body2" gutterBottom>
            {errorFourOFour.subtitle || placeholderSubtitle}
          </Typography>
          {errorFourOFour.cta && (
            <Button action={memoizedGetClickableActionFromUrl}>
              {errorFourOFour.cta?.label || placeholderCTALabel}
            </Button>
          )}
        </PromoSection>
      </Page>
    ) : (
      <FallbackComponent />
    );
  }
};

export default FourOFour;

export const pageQuery = graphql`
  {
    fourOFour {
      errorPageData {
        ...PromoCardFragment
      }
      siteData {
        ...SiteFragment
      }
    }
  }
`;
