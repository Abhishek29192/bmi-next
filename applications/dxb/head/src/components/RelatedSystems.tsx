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
import { SystemDetails } from "../templates/systemDetails/types";
import { getPathWithCountryCode } from "../schema/resolvers/utils/path";
import { findMasterImageUrl } from "../utils/product-details-transforms";
import { iconMap } from "./Icon";
import styles from "./styles/RelatedSystems.module.scss";
import { useSiteContext } from "./Site";

export type SystemCardProps = {
  system: Partial<SystemDetails>;
  countryCode: string;
  path: string;
} & Partial<OverviewCardProps>;

const findSystemBrandLogoCode = (system: Partial<SystemDetails>) => {
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
  ...rest
}: SystemCardProps) => {
  const brandLogoCode = findSystemBrandLogoCode(system);
  const brandLogo = iconMap[brandLogoCode];
  const systemUrl = getSystemUrl(countryCode, path || "system-details-page");
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
        gtm={{
          id: "cta-click1",
          label: "Read More",
          action: systemUrl
        }}
        footer={<Button variant="outlined">{"Read More"}</Button>}
        {...rest}
      >
        {system.shortDescription}
      </GTMOverviewCard>
    </Grid>
  );
};

const getWeightedSystems = (systems: ReadonlyArray<SystemDetails>) =>
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
  pageSize = 8,
  path
}: {
  countryCode: string;
  systems: ReadonlyArray<SystemDetails>;
  initialNumberShown?: number;
  pageSize?: number;
  path?: string;
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
        {weightedSystems.slice(0, numberShown).map((system) => (
          <SystemCard
            key={`${system.code}`}
            system={system}
            countryCode={countryCode}
            path={path}
          />
        ))}
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
  systems: ReadonlyArray<SystemDetails>;
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
      <Section.Title>
        {sectionTitle || getMicroCopy("sdp.recommendedSystemsTitle")}
      </Section.Title>
      <div className={styles["RelatedProducts"]}>
        <SystemListing systems={systems} countryCode={countryCode} />
      </div>
    </Section>
  );
};

export default RelatedSystems;

export const query = graphql`
  fragment RelatedSystemsFragment on DataJson {
    name
    shortDescription
    longDescription
    systemBenefits
    systemReferences {
      preselected
      referenceType
      target {
        code
        name
      }
    }
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
    systemLayers {
      layerNumber
      type
      name
      shortDescription
      relatedProducts {
        name
        variantOptions {
          path
        }
      }
      relatedOptionalProducts {
        name
        code
        variantOptions {
          path
        }
      }
    }
  }
`;
