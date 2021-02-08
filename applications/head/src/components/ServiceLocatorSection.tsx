import Autocomplete from "@bmi/autocomplete";
import CompanyDetails, {
  DetailProps,
  RoofProLevel
} from "@bmi/company-details";
import GeolocationButton from "@bmi/geolocation-button";
import GoogleAutocomplete, {
  GeocoderResult as GoogleGeocoderResult
} from "@bmi/google-autocomplete";
import { GoogleLatLng } from "@bmi/google-map";
import Grid from "@bmi/grid";
import LinkCard from "@bmi/link-card";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import { graphql } from "gatsby";
import React, { useContext, useState } from "react";
import { getClickableActionFromUrl, LinkData } from "./Link";
import RichText, { RichTextData } from "./RichText";
import { Data as RooferData } from "./Roofer";
import { SiteContext } from "./Site";
import styles from "./styles/ServiceLocatorSection.module.scss";

export type Data = {
  __typename: "ContentfulServiceLocatorSection";
  title: string;
  label: string;
  body: RichTextData | null;
  roofers: [RooferData];
};

const ServiceLocatorSection = ({ data }: { data: Data }) => {
  const { getMicroCopy, countryCode } = useContext(SiteContext);
  const [selectedRoofer, setSelectedRoofer] = useState<string>("");
  const [activePosition, setActivePosition] = useState<GoogleLatLng>(null);
  const googleApiKey = process.env.GATSBY_GOOGLE_API_KEY;
  const { label, body, roofers } = data;

  const handleListCloseClick = () => setSelectedRoofer("");

  const handleListClick = (roofer: RooferData) => {
    setSelectedRoofer(roofer.id);
  };

  const handlePlaceChange = (location: GoogleGeocoderResult) => {
    if (!location) {
      return;
    }

    setActivePosition({
      lat: location.geometry.location.lat(),
      lng: location.geometry.location.lng()
    });
  };

  const getUrlClickableAction = (url: LinkData["url"]) =>
    getClickableActionFromUrl(null, url, countryCode);

  const getCompanyDetails = (roofer: RooferData): DetailProps[] => {
    return [
      {
        type: "cta" as "cta",
        text: getMicroCopy("findARoofer.getDirectionsLabel"),
        action: getUrlClickableAction(
          `https://www.google.com/maps/dir//${roofer.address}/`
        ),
        label: getMicroCopy("findARoofer.getDirectionsLabel")
      },
      ...(roofer.phone
        ? [
            {
              type: "phone" as "phone",
              text: roofer.phone,
              action: getUrlClickableAction(`tel:${roofer.phone}`),
              label: getMicroCopy("findARoofer.telephoneLabel")
            }
          ]
        : []),
      ...(roofer.email
        ? [
            {
              type: "email" as "email",
              text: roofer.email,
              action: getUrlClickableAction(`mailto:${roofer.email}`),
              label: getMicroCopy("findARoofer.emailLabel")
            }
          ]
        : []),
      ...(roofer.website
        ? [
            {
              type: "website" as "website",
              text: getMicroCopy("findARoofer.websiteLabel"),
              action: getUrlClickableAction(roofer.website),
              label: getMicroCopy("findARoofer.websiteLabel")
            }
          ]
        : []),
      ...(roofer.type
        ? [
            {
              type: "content" as "content",
              label: getMicroCopy("findARoofer.roofTypeLabel"),
              text: <b>{roofer.type}</b>
            }
          ]
        : []),
      ...(roofer.certification
        ? [
            {
              type: "roofProLevel" as "roofProLevel",
              label: getMicroCopy("findARoofer.certificationLabel"),
              level: roofer.certification.toLowerCase() as RoofProLevel
            }
          ]
        : [])
    ];
  };

  return (
    <Section
      backgroundColor="white"
      className={styles["ServiceLocationSection"]}
    >
      <Section.Title>{label}</Section.Title>
      {body && <RichText document={body} />}
      <Grid container spacing={3} className={styles["search"]}>
        <Grid item xs={12} md={4}>
          <Autocomplete
            size="small"
            id="company-autocomplete"
            label={getMicroCopy("findARoofer.companyFieldLabel")}
            className={styles["company-autocomplete"]}
            onInputChange={(_, inputValue) => {
              // @todo Company search
            }}
            options={
              roofers && roofers.length ? roofers.map(({ name }) => name) : []
            }
          />
          {googleApiKey && (
            <>
              <Typography className={styles["and-or-label"]}>
                {getMicroCopy("findARoofer.andOr")}
              </Typography>
              <GoogleAutocomplete
                size="small"
                id="location-autocomplete"
                apiKey={googleApiKey}
                label={getMicroCopy("findARoofer.locationFieldLabel")}
                className={styles["location-autocomplete"]}
                onPlaceChange={handlePlaceChange}
              />
            </>
          )}
          <GeolocationButton
            onPosition={({ coords }) =>
              setActivePosition({ lat: coords.latitude, lng: coords.longitude })
            }
          >
            {getMicroCopy("findARoofer.geolocationButton")}
          </GeolocationButton>
        </Grid>
      </Grid>
      <Tabs
        initialValue="list"
        className={styles["tab-bar"]}
        theme="secondary"
        isMobileOnly
      >
        <Tabs.TabPanel
          md={4}
          className={styles["tab-panel"]}
          heading="List"
          index="list"
        >
          <div className={styles["list"]}>
            {roofers && roofers.length ? (
              roofers.map((roofer) => (
                <LinkCard
                  key={roofer.id}
                  onClick={() => handleListClick(roofer)}
                  onCloseClick={handleListCloseClick}
                  isOpen={selectedRoofer === roofer.id}
                  title={roofer.name}
                  subtitle={roofer.address}
                >
                  <CompanyDetails details={getCompanyDetails(roofer)}>
                    <Typography>{roofer.summary}</Typography>
                  </CompanyDetails>
                </LinkCard>
              ))
            ) : (
              <div className={styles["no-results"]}>
                <Typography variant="h4">
                  {getMicroCopy("findARoofer.noResults.title")}
                </Typography>
                <Typography>
                  {getMicroCopy("findARoofer.noResults.subtitle")}
                </Typography>
              </div>
            )}
          </div>
        </Tabs.TabPanel>
        <Tabs.TabPanel
          md={8}
          className={styles["tab-panel"]}
          heading="Map"
          index="map"
        >
          <div className={styles["map"]}>
            {/* @todo: Use `activePosition` for map here */}
          </div>
        </Tabs.TabPanel>
      </Tabs>
    </Section>
  );
};

export default ServiceLocatorSection;

export const query = graphql`
  fragment ServiceLocatorSectionFragment on ContentfulServiceLocatorSection {
    __typename
    title
    label
    body {
      ...RichTextFragment
    }
    roofers {
      ...RooferFragment
    }
  }
`;
