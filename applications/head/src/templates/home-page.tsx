import React from "react";
import Page from "../components/Page";
import { graphql } from "gatsby";
import { PageData, SiteData } from "./types";
import Container from "@bmi/container";
import Grid from "@bmi/grid";
import CTACard from "@bmi/cta-card";

type OverlapCard = {
  label: string;
  URL: string | null;
  page: {
    slug: string;
  } | null;
  image: {
    resize: {
      src: string;
    };
  } | null;
};

type HomepageData = PageData & {
  overlapCards: readonly OverlapCard[];
};

type Props = {
  data: {
    contentfulHomePage: HomepageData;
    contentfulSite: SiteData;
  };
};

const IntegratedOverlapCards = ({
  data
}: {
  data?: readonly OverlapCard[];
}) => {
  return (
    <div
      style={{
        marginTop: "-112px"
      }}
    >
      <Grid spacing={3} container justify="center">
        {data.map(({ label, image }, key) => {
          return (
            <Grid item key={key} xs={12} sm={3}>
              <CTACard title={label} imageSource={image.resize.src} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

const HomePage = ({ data }: Props) => {
  const { overlapCards, ...pageData } = data.contentfulHomePage;
  return (
    <Page pageData={pageData} siteData={data.contentfulSite}>
      <Container>
        <IntegratedOverlapCards data={overlapCards} />
      </Container>
    </Page>
  );
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageById($pageId: String!, $siteId: String!) {
    contentfulHomePage(id: { eq: $pageId }) {
      title
      showSignUpBanner
      heroes {
        title
        subtitle {
          subtitle
        }
        image {
          title
          file {
            fileName
            url
          }
        }
        cta {
          label
        }
      }
      overlapCards {
        label
        linkedPage {
          slug
        }
        image {
          resize(width: 350) {
            src
          }
        }
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      countryCode
      menuNavigation {
        ...HeaderNavigationFragment
      }
      menuUtilities {
        ...HeaderUtilitiesFragment
      }
      footerMainNavigation {
        ...FooterMainNavigationFragment
      }
      footerSecondaryNavigation {
        ...FooterSecondaryNavigationFragment
      }
      ...SignUpFragment
    }
  }
`;
