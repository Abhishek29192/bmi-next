import Button from "@bmi-digital/components/button";
import Grid from "@bmi-digital/components/grid";
import AddIcon from "@bmi-digital/components/icon/Add";
import Section, {
  BackgroundColor as SectionBackgroundColor
} from "@bmi-digital/components/section";
import SystemResultsCard from "@bmi-digital/components/system-results-card";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { System as EsSystem, SystemAttribute } from "@bmi/elasticsearch-types";
import { microCopy } from "@bmi/microcopies";
import NextLink from "next/link";
import React, { useState } from "react";
import { RelatedSystem } from "../types/pim";
import {
  getLevel,
  goodBetterBestLabels
} from "../utils/getGoodBetterBestLabel";

import { getPathWithCountryCode } from "../utils/path";
import BrandLogo from "./BrandLogo";
import { useSiteContext } from "./Site";
import {
  StyledLoadMoreWrapper,
  StyledTitle
} from "./styles/RelatedSystems.styles";
import type { GTM } from "@bmi-digital/components/types";

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
): string[] => {
  if (systemPropertiesToDisplay.length === 0 || !isEsSystem(system)) {
    return [];
  }

  const filteredSystemAttributes = (system.systemAttributes || []).filter(
    (attr) =>
      systemPropertiesToDisplay.some(
        (syspProp) =>
          attr.code.includes(syspProp) || attr.name?.includes(syspProp)
      )
  );

  return systemPropertiesToDisplay
    .reduce<SystemAttribute[]>((accSystemAttributes, currentAttribute) => {
      return [
        ...accSystemAttributes,
        ...filteredSystemAttributes.filter(
          (systemAttributeObj) =>
            systemAttributeObj.code.includes(currentAttribute) ||
            systemAttributeObj.name?.includes(currentAttribute)
        )
      ];
    }, [])
    .reduce<string[]>((acc, curSystemAttrObj) => {
      return [...acc, ...curSystemAttrObj.values];
    }, [])
    .slice(0, 3);
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

  return (
    <Grid
      xs={12}
      md={6}
      lg={3}
      data-testid={
        dataTestId ? dataTestId : `system-card-${replaceSpaces(system.code)}`
      }
    >
      <SystemResultsCard
        title={system.name}
        media={mainImage ? { src: mainImage, alt: system.name } : undefined}
        tag={
          system.goodBetterBest && {
            level: getLevel(system.goodBetterBest),
            label: getMicroCopy(goodBetterBestLabels[system.goodBetterBest])
          }
        }
        brandLogo={
          system.brand?.code ? (
            <BrandLogo brandName={system.brand.code} />
          ) : undefined
        }
        gtm={gtm}
        ctaLabel={getMicroCopy(microCopy.SDP_SYSTEM_READ_MORE)}
        component={NextLink}
        href={systemUrl}
        highlighted={isHighlighted}
        description={system.shortDescription ?? undefined}
        systemProperties={getFilteredSystemPropertyValuesList(
          system,
          systemPropertiesToDisplay
        )}
        {...rest}
      />
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

// export const query = graphql`
//   fragment RelatedSystemFragment on System {
//     brand {
//       code
//     }
//     code
//     galleryImages {
//       ...PIMImageFragment
//     }
//     goodBetterBest
//     masterImage {
//       ...PIMImageFragment
//     }
//     name
//     path
//     scoringWeight
//     shortDescription
//   }
// `;
