import {
  Button,
  Grid,
  OverviewCard,
  OverviewCardProps,
  replaceSpaces,
  Section,
  SectionBackgroundColor
} from "@bmi-digital/components";
import CheckMarkIcon from "@bmi-digital/components/icon/Check";
import uniqueId from "lodash-es/uniqueId";
import { System as EsSystem } from "@bmi/elasticsearch-types";
import AddIcon from "@bmi-digital/components/icon/Add";
import { graphql, Link } from "gatsby";
import React, { useState } from "react";
import { microCopy } from "@bmi/microcopies";
import { RelatedSystem } from "../types/pim";
import withGTM, { GTM } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { renderMedia } from "../utils/renderMedia";
import BrandLogo from "./BrandLogo";
import { useSiteContext } from "./Site";
import {
  StyledLoadMoreWrapper,
  StyledReadMoreButton,
  StyledTitle,
  StyledSystemPropertyContainer,
  StyledSystemPropertyItem
} from "./styles/RelatedSystems.styles";
import GoodBetterBestIndicator from "./GoodBetterBestIndicator";

export type SystemCardProps = {
  system: RelatedSystem | EsSystem;
  systemPropertiesToDisplay?: string[];
  countryCode: string;
  path: string;
  gtm: GTM;
  isHighlighted?: boolean;
  "data-testid"?: string;
};

const getSystemUrl = (countryCode: string, path: string) =>
  getPathWithCountryCode(countryCode, path);

const isEsSystem = (system: RelatedSystem | EsSystem): system is EsSystem =>
  Object.keys(system).includes("systemAttributes");

const getFilteredSystemPropertyValuesList = (
  system: RelatedSystem | EsSystem,
  systemPropertiesToDisplay: string[]
) => {
  if (!isEsSystem(system)) {
    return null;
  }

  if (systemPropertiesToDisplay.length === 0) {
    return null;
  }

  let filteredSystemAttributes = system.systemAttributes || [];

  if (systemPropertiesToDisplay && systemPropertiesToDisplay.length !== 0) {
    filteredSystemAttributes = filteredSystemAttributes.filter((attr) =>
      systemPropertiesToDisplay.some(
        (syspProp) =>
          attr.code.includes(syspProp) || attr.name.includes(syspProp)
      )
    );
  }

  const topThreePropertiesToDisplay = systemPropertiesToDisplay
    .reduce((accSystemAttributes, currentAttribute) => {
      return [
        ...accSystemAttributes,
        ...filteredSystemAttributes.filter(
          (systemAttributeObj) =>
            systemAttributeObj.code.includes(currentAttribute) ||
            systemAttributeObj.name.includes(currentAttribute)
        )
      ];
    }, [])
    .reduce((acc, curSystemAttrObj) => {
      return [...acc, ...curSystemAttrObj.values];
    }, [])
    .slice(0, 3);

  if (topThreePropertiesToDisplay.length === 0) {
    return null;
  }
  return (
    <StyledSystemPropertyContainer data-testid="systemProperties">
      {topThreePropertiesToDisplay.map((attrVal) => (
        <StyledSystemPropertyItem
          key={uniqueId()}
          data-testid="systemPropItemPanel"
        >
          <CheckMarkIcon />
          {attrVal}
        </StyledSystemPropertyItem>
      ))}
    </StyledSystemPropertyContainer>
  );
};

export const SystemCard = ({
  system,
  systemPropertiesToDisplay = [],
  countryCode,
  path,
  gtm,
  isHighlighted = false,
  "data-testid": dataTestId,
  ...rest
}: SystemCardProps) => {
  const { getMicroCopy } = useSiteContext();
  const systemUrl = getSystemUrl(countryCode, path);
  const mainImage =
    system.masterImage?.mainSource || system.galleryImages[0]?.mainSource;
  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <Grid
      xs={12}
      md={6}
      lg={3}
      data-testid={
        dataTestId ? dataTestId : `system-card-${replaceSpaces(system.code)}`
      }
    >
      <GTMOverviewCard
        title={system.name}
        titleVariant="h5"
        imageSize="contain"
        media={renderMedia(mainImage, system.name)}
        tag={<GoodBetterBestIndicator indicatorType={system.goodBetterBest} />}
        brandImageSource={
          <BrandLogo
            brandName={
              typeof system.brand === "string"
                ? system.brand
                : system.brand?.code
            }
          />
        }
        action={{
          model: "routerLink",
          linkComponent: Link,
          to: systemUrl
        }}
        gtm={gtm}
        footer={
          <StyledReadMoreButton variant="outlined">
            {getMicroCopy(microCopy.SDP_SYSTEM_READ_MORE)}
          </StyledReadMoreButton>
        }
        isHighlighted={isHighlighted}
        {...rest}
      >
        <div>
          {system.shortDescription}

          {systemPropertiesToDisplay &&
            getFilteredSystemPropertyValuesList(
              system,
              systemPropertiesToDisplay
            )}
        </div>
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
        <StyledLoadMoreWrapper>
          <Button onClick={onLoadMore} variant="outlined" endIcon={<AddIcon />}>
            {getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_SHOW_MORE)}
          </Button>
        </StyledLoadMoreWrapper>
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
    <Section
      backgroundColor={sectionBackgroundColor || "alabaster"}
      data-testid={`related-systems-section`}
    >
      <div>
        <StyledTitle>
          {sectionTitle ||
            getMicroCopy(microCopy.SDP_RECOMMENDED_SYSTEMS_TITLE)}
        </StyledTitle>
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
    galleryImages {
      ...PIMImageFragment
    }
    goodBetterBest
    masterImage {
      ...PIMImageFragment
    }
    name
    path
    scoringWeight
    shortDescription
  }
`;
