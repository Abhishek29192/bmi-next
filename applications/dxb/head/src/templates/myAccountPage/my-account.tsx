import {
  Grid,
  Hero,
  Section,
  ToolCardItemProps,
  ToolCards
} from "@bmi-digital/components";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import React from "react";
import BackToResults from "../../components/BackToResults";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContactDetails, {
  Data as ContactDetailsData
} from "../../components/ContactDetails";
import Image, { type Data as ContentfulImage } from "../../components/Image";
import Page from "../../components/Page";
import { Data as SiteData, useSiteContext } from "../../components/Site";
import useAuth from "../../hooks/useAuth";
import Protected from "../../pages/protected";
import { HelloText, ToolCardsBox, classes } from "./styles";
import { getUserInfo, transformToolCar } from "./utils";

type Props = {
  data: {
    contentfulSite: Omit<SiteData, "accountPage"> & {
      accountPage: AccountPage;
    };
  };
};

export type AccountPage = {
  featuredMedia: ContentfulImage | null;
  salutation: string;
  description: string;
  titleForToolSection: string;
  titleForServiceSupportSection: string;
  serviceSupportCards: ContactDetailsData[];
  slug: string;
  allowTools: [string];
};

const MyAccountPage = ({ data }: Props) => {
  const { profile } = useAuth();
  const {
    featuredMedia,
    salutation,
    description,
    titleForToolSection,
    titleForServiceSupportSection,
    serviceSupportCards,
    slug,
    allowTools
  } = data.contentfulSite.accountPage;
  const { getMicroCopy } = useSiteContext();
  const transformHeroText: { salutation: string; description: string } =
    profile && getUserInfo(profile, salutation, description);
  const transformToolCardData: [ToolCardItemProps, ...ToolCardItemProps[]] =
    allowTools && transformToolCar(allowTools, getMicroCopy);

  return (
    <Protected>
      <Page
        title="My acc page"
        pageData={{
          breadcrumbs: null,
          signupBlock: null,
          seo: null,
          path: ""
        }}
        siteData={data.contentfulSite}
      >
        <Hero
          level={1}
          title={
            <HelloText>
              {transformHeroText && transformHeroText.salutation}
            </HelloText>
          }
          media={
            featuredMedia ? (
              <Image {...featuredMedia} size="cover" />
            ) : undefined
          }
          breadcrumbs={
            <BackToResults isDarkThemed data-testid="breadcrumbs-section-top">
              <Breadcrumbs
                data={[
                  {
                    id: "",
                    label: getMicroCopy(microCopy.MY_ACCOUNT_LABEL),
                    slug: slug
                  }
                ]}
                isDarkThemed
                data-testid="my-acc-page-breadcrumbs-top"
              />
            </BackToResults>
          }
        >
          {transformHeroText && transformHeroText.description}
        </Hero>
        <Section backgroundColor="pearl">
          <Section.Title>{titleForToolSection}</Section.Title>
          <ToolCardsBox>
            <ToolCards items={transformToolCardData} className={classes.box} />
          </ToolCardsBox>
        </Section>
        <Section>
          <Section.Title>{titleForServiceSupportSection}</Section.Title>
          <Grid container={serviceSupportCards.length > 1} spacing={3}>
            {serviceSupportCards.map((data) => {
              const serviceSupportKey = `service-support-card-${data.title}`;
              return (
                <Grid
                  key={serviceSupportKey}
                  xs={12}
                  lg={6}
                  data-testid={serviceSupportKey}
                >
                  <ContactDetails data={data} gtmLabel={data.title} />
                </Grid>
              );
            })}
          </Grid>
        </Section>
      </Page>
    </Protected>
  );
};
export default MyAccountPage;

export const pageQuery = graphql`
  query AccountPage($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
      accountPage {
        slug
        featuredMedia {
          ...ImageDocumentFragment
        }
        salutation
        description
        titleForToolSection
        titleForServiceSupportSection
        allowTools
        serviceSupportCards {
          ...ContactDetailsFragment
        }
      }
    }
  }
`;
