import Autocomplete from "@bmi/autocomplete";
import GeolocationButton from "@bmi/geolocation-button";
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
  const [selectedLinkCard, setSelectedLinkCard] = useState<string>("");
  const [userPosition, setUserPosision] = useState<Position>();
  const { label, body, roofers } = data;

  const handleListCloseClick = () => setSelectedLinkCard("");

  const handleListClick = (roofer: RooferData) => {
    setSelectedLinkCard(roofer.id);
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
          <Typography className={styles["and-or-label"]}>
            {getMicroCopy("findARoofer.andOr")}
          </Typography>
          <Autocomplete
            size="small"
            id="location-autocomplete"
            label={getMicroCopy("findARoofer.locationFieldLabel")}
            className={styles["location-autocomplete"]}
            options={[]}
          />
          <GeolocationButton onPosition={setUserPosision}>
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
                    isOpen={selectedLinkCard === roofer.id}
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
          <div className={styles["map"]}>Map</div>
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
