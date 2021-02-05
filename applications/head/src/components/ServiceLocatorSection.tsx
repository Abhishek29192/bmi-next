import Autocomplete from "@bmi/autocomplete";
import GeolocationButton from "@bmi/geolocation-button";
import GoogleAutocomplete, {
  GeocoderResult as GoogleGeocoderResult
} from "@bmi/google-autocomplete";
import Grid from "@bmi/grid";
import LinkCard from "@bmi/link-card";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import { graphql } from "gatsby";
import React, { useContext, useState } from "react";
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
  const { getMicroCopy } = useContext(SiteContext);
  const [selectedRoofer, setSelectedRoofer] = useState<string>("");
  const [activePosition, setActivePosition] = useState<Position>(null);
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

    // @todo: No nice way to create a native GeolocationPosition object?
    setActivePosition({
      coords: {
        accuracy: null,
        latitude: location.geometry.location.lat(),
        longitude: location.geometry.location.lng(),
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: +new Date()
    });
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
            options={roofers ? roofers.map(({ name }) => name) : []}
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
          <GeolocationButton onPosition={setActivePosition}>
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
            {roofers
              ? roofers.map((roofer) => (
                  <LinkCard
                    key={roofer.id}
                    onClick={() => handleListClick(roofer)}
                    onCloseClick={handleListCloseClick}
                    isOpen={selectedRoofer === roofer.id}
                    title={roofer.name}
                    subtitle={roofer.address}
                  >
                    {roofer.summary}
                  </LinkCard>
                ))
              : getMicroCopy("findARoofer.noResults")}
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
