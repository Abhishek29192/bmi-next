import { Button, PromoSection, Typography } from "@bmi/components";
import { graphql } from "gatsby";
import React from "react";
import FallbackComponent from "../components/FallbackComponent";
import { renderImage } from "../components/Image";
import { getClickableActionFromUrl } from "../components/Link";
import Page from "../components/Page";
import { renderVideo } from "../components/Video";
import { FourOFourResponse } from "../types/pim";

type Data = {
  FourOFour: FourOFourResponse;
};

const FourOFour = ({ data }: { data: Data }) => {
  const siteData = data.FourOFour.siteData;
  const errorFourOFour = data.FourOFour.errorPageData;
  {
    return siteData && errorFourOFour ? (
      <Page
        title={errorFourOFour.title || "Error:404.title"}
        pageData={{
          breadcrumbs: null,
          signupBlock: null,
          seo: null,
          path: null
        }}
        siteData={siteData}
      >
        <PromoSection
          title={errorFourOFour.title}
          media={
            errorFourOFour.featuredVideo
              ? renderVideo(errorFourOFour.featuredVideo)
              : renderImage(errorFourOFour.featuredMedia)
          }
        >
          <Typography variant="body2" gutterBottom>
            {errorFourOFour.subtitle}
          </Typography>
          {errorFourOFour.cta && (
            <Button
              action={getClickableActionFromUrl(
                errorFourOFour.cta?.linkedPage,
                errorFourOFour.cta?.url,
                // TODO: As per below TODO
                // Tracked by https://bmigroup.atlassian.net/browse/DXB-1197
                // rc note: improved, this would be sufficient if the bit on line
                //          21 were correct
                siteData?.countryCode,
                null,
                errorFourOFour.cta.label
              )}
            >
              {errorFourOFour.cta.label}
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
    FourOFour {
      errorPageData {
        ...PromoCardFragment
      }
      siteData {
        ...SiteFragment
      }
    }
  }
`;
