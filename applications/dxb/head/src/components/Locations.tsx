import { graphql } from "gatsby";
import React, { useContext, useState } from "react";
import Grid from "@bmi/grid";
import Button from "@bmi/button";
import { SiteContext } from "./Site";
import styles from "./styles/Locations.module.scss";
import ContactDetails, { Data as ContactDetailsData } from "./ContactDetails";

export type Data = ContactDetailsData[];

const LOCATIONS_PER_PAGE = 6;

const Locations = ({ data }: { data: Data }) => {
  const { getMicroCopy } = useContext(SiteContext);
  const showMoreText = getMicroCopy("global.showMore");
  const [numberVisible, setNumberVisible] = useState(LOCATIONS_PER_PAGE);

  const locationCards = (
    <Grid container spacing={3}>
      {data.slice(0, numberVisible).map((data, index) => {
        return (
          <Grid item key={`locations-card-${index}`} xs={12} lg={6}>
            <ContactDetails data={data} />
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <div className={styles["Locations"]}>
      {locationCards}
      {numberVisible < data.length ? (
        <Button
          className={styles["button"]}
          variant="outlined"
          onClick={() =>
            setNumberVisible((prevNum) => prevNum + LOCATIONS_PER_PAGE)
          }
        >
          {showMoreText}
        </Button>
      ) : null}
    </div>
  );
};

export default Locations;

export const query = graphql`
  fragment LocationsFragment on ContentfulContactDetails {
    ...ContactDetailsFragment
  }
`;
