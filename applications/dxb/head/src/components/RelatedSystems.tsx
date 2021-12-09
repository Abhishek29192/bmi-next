import React, { useMemo, useState } from "react";
import { Link, graphql } from "gatsby";
import Grid from "@bmi/grid";
import OverviewCard, { OverviewCardProps } from "@bmi/overview-card";
import Button from "@bmi/button";
import Section from "@bmi/section";
import { Add as AddIcon } from "@material-ui/icons";
import { uniqBy } from "lodash";
import { BackgroundColor } from "@bmi/section/src/Section";
import withGTM from "../utils/google-tag-manager";
import { System } from "../components/types/pim";
import { getPathWithCountryCode } from "../utils/path";
import { findMasterImageUrl } from "../utils/product-details-transforms";
import { iconMap } from "./Icon";
import styles from "./styles/RelatedSystems.module.scss";
import { useSiteContext } from "./Site";

export type SystemCardProps = {
  system: Partial<System>;
  countryCode: string;
  path: string;
  gtm: {
    event?: string;
    id: string;
    label?: string;
    action?: string;
  };
} & Partial<OverviewCardProps>;

const findSystemBrandLogoCode = (system: Partial<System>) => {
  //check if system is tagged to more than one brand
  const totalBrand = system.categories?.filter(
    (category) => category.categoryType === "Brand"
  );
  if (totalBrand?.length === 1) {
    return totalBrand[0].code;
  }
  return null;
};

const getSystemUrl = (countryCode, path) =>
  getPathWithCountryCode(countryCode, path);

export const SystemCard = ({
  system,
  countryCode,
  path,
  gtm,
  isHighlighted
}: SystemCardProps) => {
  const { getMicroCopy } = useSiteContext();
  const brandLogoCode = findSystemBrandLogoCode(system);
  // eslint-disable-next-line security/detect-object-injection
  const brandLogo = iconMap[brandLogoCode];
  const systemUrl = getSystemUrl(countryCode, path);
  const mainImage = findMasterImageUrl(system.images || []);
  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <Grid item xs={12} md={6} lg={3}>
      <GTMOverviewCard
        title={system.name}
        titleVariant="h5"
        imageSize="contain"
        imageSource={mainImage}
        brandImageSource={brandLogo}
        action={{
          model: "routerLink",
          linkComponent: Link,
          to: systemUrl
        }}
        gtm={gtm}
        footer={
          <Button variant="outlined">
            {getMicroCopy("sdp.system.readMore")}
          </Button>
        }
        isHighlighted={isHighlighted}
      >
        {system.shortDescription}
      </GTMOverviewCard>
    </Grid>
  );
};

const getWeightedSystems = (systems: ReadonlyArray<System>) =>
  uniqBy(systems, (system) => system.name).sort((a, b) => {
    const getWeightValue = (system) =>
      system.classifications?.find(
        ({ code }) => code === "ScoringWeightAttributes"
      )?.features[0]?.featureValues[0]?.value || 0;

    const weightA = getWeightValue(a);
    const weightB = getWeightValue(b);
    if (weightB === weightA) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
    }

    return weightB - weightA;
  });
const SystemListing = ({
  countryCode,
  systems,
  initialNumberShown = 8,
  pageSize = 8
}: {
  countryCode: string;
  systems: ReadonlyArray<System>;
  initialNumberShown?: number;
  pageSize?: number;
}) => {
  const [numberShown, setNumberShown] = useState(initialNumberShown);
  const { getMicroCopy } = useSiteContext();

  const onLoadMore = () => {
    setNumberShown((numberShown) => numberShown + pageSize);
  };

  const weightedSystems = useMemo(() => getWeightedSystems(systems), [systems]);

  return (
    <>
      <Grid container spacing={3}>
        {weightedSystems.slice(0, numberShown).map((system) => {
          return (
            <SystemCard
              key={`${system.code}`}
              system={system}
              countryCode={countryCode}
              path={system.path}
              gtm={{
                id: "cta-click1",
                label:
                  system.name + " - " + getMicroCopy("sdp.system.readMore"),
                action: getSystemUrl(countryCode, system.path)
              }}
            />
          );
        })}
      </Grid>
      {numberShown < weightedSystems.length ? (
        <div className={styles["load-more-wrapper"]}>
          <Button onClick={onLoadMore} variant="outlined" endIcon={<AddIcon />}>
            {getMicroCopy("pdp.relatedProducts.showMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export type Props = {
  systems: ReadonlyArray<System>;
  countryCode: string;
  sectionTitle?: string;
  sectionDescription?: string;
  sectionBackgroundColor?: BackgroundColor;
};

// TODO: Do a context for countryCode and classificationNamespace
const RelatedSystems = ({
  systems,
  countryCode,
  sectionTitle,
  sectionBackgroundColor
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  //populate other fields of systems in the array

  if (Object.entries(systems).length === 0) {
    return null;
  }
  return (
    <Section backgroundColor={sectionBackgroundColor || "alabaster"}>
      <div className={styles["RelatedSystems"]}>
        <Section.Title className={styles["title"]}>
          {sectionTitle || getMicroCopy("sdp.recommendedSystemsTitle")}
        </Section.Title>
        <SystemListing systems={systems} countryCode={countryCode} />
      </div>
    </Section>
  );
};

export default RelatedSystems;

export const query = graphql`
  fragment RelatedSystemsFragment on Systems {
    name
    shortDescription
    longDescription
    systemBenefits
    approvalStatus
    systemReferences {
      preselected
      referenceType
      target {
        code
        name
      }
    }
    path
    assets {
      allowedToDownload
      assetType
      fileSize
      mime
      name
      realFileName
      url
    }
    categories {
      categoryType
      name
      image {
        url
        name
        mime
        fileSize
        allowedToDownload
      }
    }
    classifications {
      code
      features {
        code
        featureValues {
          value
        }
        name
        featureUnit {
          symbol
        }
      }
      name
    }
    images {
      assetType
      fileSize
      mime
      name
      realFileName
      url
      format
      containerId
    }
  }
`;
