import {
  Button,
  Grid,
  OverviewCard,
  OverviewCardProps,
  Section,
  SectionBackgroundColor
} from "@bmi-digital/components";
import { System as EsSystem } from "@bmi/elasticsearch-types";
import { Add as AddIcon } from "@mui/icons-material";
import { graphql, Link } from "gatsby";
import React, { useState } from "react";
import { microCopy } from "../constants/microCopies";
import { RelatedSystem } from "../types/pim";
import withGTM, { GTM } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { renderMedia } from "../utils/renderMedia";
import { iconMap } from "./Icon";
import { useSiteContext } from "./Site";
import styles from "./styles/RelatedSystems.module.scss";

export type SystemCardProps = {
  system: RelatedSystem | EsSystem;
  countryCode: string;
  path: string;
  gtm: GTM;
  isHighlighted?: boolean;
};

const getSystemUrl = (countryCode, path) =>
  getPathWithCountryCode(countryCode, path);

export const SystemCard = ({
  system,
  countryCode,
  path,
  gtm,
  isHighlighted = false,
  ...rest
}: SystemCardProps) => {
  const { getMicroCopy } = useSiteContext();
  // eslint-disable-next-line security/detect-object-injection
  const brandLogo =
    iconMap[
      typeof system.brand === "string" ? system.brand : system.brand?.code
    ];
  const systemUrl = getSystemUrl(countryCode, path);
  const mainImage = system.images[0]?.mainSource;
  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <Grid xs={12} md={6} lg={3}>
      <GTMOverviewCard
        title={system.name}
        titleVariant="h5"
        imageSize="contain"
        media={renderMedia(mainImage, system.name)}
        brandImageSource={brandLogo}
        action={{
          model: "routerLink",
          linkComponent: Link,
          to: systemUrl
        }}
        gtm={gtm}
        footer={
          <Button variant="outlined">
            {getMicroCopy(microCopy.SDP_SYSTEM_READ_MORE)}
          </Button>
        }
        isHighlighted={isHighlighted}
        {...rest}
      >
        {system.shortDescription}
      </GTMOverviewCard>
    </Grid>
  );
};

const SystemListing = ({
  countryCode,
  systems,
  initialNumberShown = 8,
  pageSize = 8
}: {
  countryCode: string;
  systems: readonly RelatedSystem[];
  initialNumberShown?: number;
  pageSize?: number;
}) => {
  const [numberShown, setNumberShown] = useState(initialNumberShown);
  const { getMicroCopy } = useSiteContext();

  const onLoadMore = () => {
    setNumberShown((numberShown) => numberShown + pageSize);
  };

  return (
    <>
      <Grid container spacing={3}>
        {systems.slice(0, numberShown).map((system) => {
          return (
            <SystemCard
              key={`${system.code}`}
              system={system}
              countryCode={countryCode}
              path={system.path}
              gtm={{
                id: "cta-click1",
                label:
                  system.name +
                  " - " +
                  getMicroCopy(microCopy.SDP_SYSTEM_READ_MORE),
                action: getSystemUrl(countryCode, system.path)
              }}
            />
          );
        })}
      </Grid>
      {numberShown < systems.length ? (
        <div className={styles["load-more-wrapper"]}>
          <Button onClick={onLoadMore} variant="outlined" endIcon={<AddIcon />}>
            {getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_SHOW_MORE)}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export type Props = {
  systems: readonly RelatedSystem[];
  countryCode: string;
  sectionTitle?: string;
  sectionDescription?: string;
  sectionBackgroundColor?: SectionBackgroundColor;
};

// TODO: Do a context for countryCode and classificationNamespace
const RelatedSystems = ({
  systems,
  countryCode,
  sectionTitle,
  sectionBackgroundColor
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <Section backgroundColor={sectionBackgroundColor || "alabaster"}>
      <div className={styles["RelatedSystems"]}>
        <Section.Title className={styles["title"]}>
          {sectionTitle ||
            getMicroCopy(microCopy.SDP_RECOMMENDED_SYSTEMS_TITLE)}
        </Section.Title>
        <SystemListing systems={systems} countryCode={countryCode} />
      </div>
    </Section>
  );
};

export default RelatedSystems;

export const query = graphql`
  fragment RelatedSystemFragment on System {
    brand {
      code
    }
    code
    images {
      ...PIMImageFragment
    }
    name
    path
    scoringWeight
    shortDescription
  }
`;
