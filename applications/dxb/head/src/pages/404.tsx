import React from "react";
import { graphql } from "gatsby";
import Button from "@bmi-digital/components/button";
import Typography from "@bmi-digital/components/typography";
import PromoSection from "@bmi-digital/components/promo-section";
import Page from "../components/Page";
import { Data as SiteData } from "../components/Site";
import { getClickableActionFromUrl } from "../components/Link";
import { renderImage } from "../components/Image";
import { renderVideo } from "../components/Video";

type Data = {
  allContentfulSite: {
    nodes: SiteData[];
  };
};

const FourOFour = ({ data }: { data: Data }) => {
  const siteData = data.allContentfulSite.nodes[0];
  const { errorFourOFour } = siteData.resources;

  const {
    title = "Error:404.title",
    subtitle = "Error:404.subtitle",
    cta = {
      label: "Error:404.cta.label",
      linkedPage: undefined,
      url: undefined
    },
    featuredMedia = null,
    featuredVideo = null
  } = errorFourOFour || {};

  return (
    <Page
      title={title || "Error:404.title"}
      pageData={{ breadcrumbs: null, inputBanner: null, seo: null, path: null }}
      siteData={siteData}
    >
      <PromoSection
        title={title}
        media={
          featuredVideo
            ? renderVideo(featuredVideo)
            : renderImage(featuredMedia)
        }
      >
        <Typography variant="body2" gutterBottom>
          {subtitle}
        </Typography>
        {cta && (
          <Button
            action={getClickableActionFromUrl(
              cta?.linkedPage,
              cta?.url,
              // TODO: As per below TODO
              // Tracked by https://bmigroup.atlassian.net/browse/DXB-1197
              // rc note: improved, this would be sufficient if the bit on line
              //          21 were correct
              siteData?.countryCode,
              null,
              cta.label
            )}
          >
            {cta.label}
          </Button>
        )}
      </PromoSection>
    </Page>
  );
};

export default FourOFour;

export const pageQuery = graphql`
  {
    # TODO: The country code should come from somewhere else, however unable to
    # pass the context to this page.
    # Tracked by https://bmigroup.atlassian.net/browse/DXB-1197
    # rc note: filter not required at this stage - site isn't ready for it
    #    the following allows it to search all sites, but not break the build
    allContentfulSite(filter: { countryCode: { ne: "99" } }) {
      nodes {
        ...SiteFragment
      }
    }
  }
`;
