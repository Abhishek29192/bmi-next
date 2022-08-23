import { Button, PromoSection, Typography } from "@bmi/components";
import { graphql } from "gatsby";
import React from "react";
import { renderImage } from "../components/Image";
import { getClickableActionFromUrl } from "../components/Link";
import Page from "../components/Page";
import { Data as SiteData } from "../components/Site";
import { renderVideo } from "../components/Video";

type Data = {
  allContentfulSite: {
    nodes: SiteData[];
  };
};

const FourOFour = ({ data }: { data: Data }) => {
  const siteData = data.allContentfulSite.nodes.filter(
    (node) =>
      node.countryCode === `${process.env.SPACE_MARKET_CODE}` &&
      node.node_locale === `${process.env.GATSBY_MARKET_LOCALE_CODE}`
  )[0];
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
      pageData={{ breadcrumbs: null, signupBlock: null, seo: null, path: null }}
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
    allContentfulSite {
      nodes {
        ...SiteFragment
      }
    }
  }
`;
