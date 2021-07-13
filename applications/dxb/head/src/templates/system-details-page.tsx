import React from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@bmi/button";
import IconList from "@bmi/icon-list";
import CheckIcon from "@material-ui/icons/Check";

import Page from "../components/Page";
import { Data as SiteData } from "../components/Site";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "../components/ShareWidgetSection";
import Image, { Data as ImageData } from "../components/Image";

const BlueCheckIcon = <CheckIcon style={{ color: "#009fe3" }} />;

import styles from "./styles/system-details-page.module.scss";

export interface SystemDetails {
  name: string;
  categories: {
    categoryType: string;
    name: string;
    image?: {
      url: string;
      name: string;
      mime: string;
      fileSize: number;
      containerId: string;
      assetType: string;
      altText: string;
      allowedToDownload: boolean;
      realFileName: string;
    };
  }[];
  classifications: {
    code: "systemAttributes" | "measurementAttributes";
    features: {
      code:
        | "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup"
        | "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent";
      featureValues: { value: string }[];
      name: string;
    }[];
    name: string;
  }[];
}

type Props = {
  pageContext: {
    systemPageId: string;
    siteId: string;
  };
  data: {
    contentfulSite: SiteData;
    dataJson: SystemDetails;
    shareWidget: ShareWidgetSectionData | null;
  };
};

const getBrandLogo = (
  categories: SystemDetails["categories"]
): null | ImageData => {
  const brandCategory = categories.find((c) => c.categoryType === "Brand");
  if (!brandCategory) return null;

  return {
    type: null,
    altText: brandCategory.image.altText,
    image: {
      file: {
        fileName: brandCategory.image.realFileName,
        url: brandCategory.image.url
      }
    },
    caption: null,
    focalPoint: null
  };
};

const getPromotionalContent = (
  classifications: SystemDetails["classifications"]
): string | null => {
  const systemAttributes = classifications.find(
    (c) => c.code === "systemAttributes"
  );
  if (!systemAttributes) return null;

  const { features } = systemAttributes;

  const content = features.find(
    (feature) =>
      feature.code ===
      "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent"
  );
  if (!content) return null;

  return content.featureValues[0].value;
};

const SystemDetailsPage = ({ data }: Props) => {
  const { contentfulSite, dataJson } = data;
  const { resources } = contentfulSite;
  const { name } = dataJson;

  const brandLogo = getBrandLogo(dataJson.categories);
  const promotionalContent = getPromotionalContent(dataJson.classifications);

  return (
    <Page
      title="System Details Page Demo"
      pageData={{ breadcrumbs: null, inputBanner: null, seo: null }}
      siteData={contentfulSite}
    >
      {resources?.sdpShareWidget && (
        <ShareWidgetSection data={resources.sdpShareWidget} />
      )}

      <Section backgroundColor="white">
        <LeadBlock>
          <LeadBlock.Content>
            {brandLogo && (
              <LeadBlock.Content.Section>
                <Image data={brandLogo} className={styles["brandLogo"]} />
              </LeadBlock.Content.Section>
            )}

            <LeadBlock.Content.Section>
              <Typography variant="h1" hasUnderline>
                {name}
              </Typography>
            </LeadBlock.Content.Section>

            {promotionalContent && (
              <LeadBlock.Content.Section>
                <Typography variant="body2">{promotionalContent}</Typography>
              </LeadBlock.Content.Section>
            )}

            <LeadBlock.Content.Section className={styles["ctaContainer"]}>
              <AnchorLink
                action={{ model: "htmlLink", href: "/" }}
                iconStart
                iconInverted
              >
                Back to your selection
              </AnchorLink>

              <Button
                className={styles["quotationBtn"]}
                endIcon={<ArrowForwardIcon />}
              >
                Get a Quotation
              </Button>
            </LeadBlock.Content.Section>
          </LeadBlock.Content>
          <LeadBlock.Card theme="pearl">
            <LeadBlock.Card.Section>
              <IconList>
                <IconList.Item
                  isCompact
                  icon={BlueCheckIcon}
                  title="Lorem, ipsum dolor sit amet consectetur adipisicing elit"
                />
                <IconList.Item
                  isCompact
                  icon={BlueCheckIcon}
                  title="Minoritetsladningsbærerdiffusjonskoeffisientmålingsapparatur"
                />
                <IconList.Item
                  isCompact
                  icon={BlueCheckIcon}
                  title="Excepturi eaque delectus rerum maxime vitae minus error ipsam suscipit totam ab voluptates accusamus quia"
                />
              </IconList>
            </LeadBlock.Card.Section>
          </LeadBlock.Card>
        </LeadBlock>
      </Section>
    </Page>
  );
};

export default SystemDetailsPage;

export const pageQuery = graphql`
  query SystemDetailsPage($siteId: String!, $systemPageId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    dataJson(id: { eq: $systemPageId }) {
      name
      shortDescription
      longDescription
      categories {
        categoryType
        name
        image {
          url
          name
          mime
          fileSize
          containerId
          assetType
          altText
          allowedToDownload
          realFileName
        }
      }
      classifications {
        code
        features {
          code
          featureValues {
            value
          }
        }
      }
    }
  }
`;
