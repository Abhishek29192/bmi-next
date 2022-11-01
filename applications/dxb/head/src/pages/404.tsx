import { Button, PromoSection, Typography } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import FallbackComponent from "../components/FallbackComponent";
import { renderImage } from "../components/Image";
import { getClickableActionFromUrl } from "../components/Link";
import Page from "../components/Page";
import { renderVideo } from "../components/Video";
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
            errorFourOFour.featuredVideo
              ? renderVideo(errorFourOFour.featuredVideo)
              : renderImage(errorFourOFour.featuredMedia)
          }
        >
          <Typography variant="body2" gutterBottom>
            {errorFourOFour.subtitle || placeholderSubtitle}
          </Typography>
          {errorFourOFour.cta && (
            <Button
              action={getClickableActionFromUrl(
                errorFourOFour.cta?.linkedPage,
                errorFourOFour.cta?.url,
                siteData?.countryCode,
                null,
                errorFourOFour.cta?.label || placeholderCTALabel
              )}
            >
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
