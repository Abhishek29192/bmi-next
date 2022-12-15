import { Button, Grid } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React, { useState } from "react";
import { microCopy } from "../constants/microCopies";
import ContactDetails, { Data as ContactDetailsData } from "./ContactDetails";
import { useSiteContext } from "./Site";
import styles from "./styles/Locations.module.scss";

export type Data = ContactDetailsData[];

const LOCATIONS_PER_PAGE = 6;

const Locations = ({ data }: { data: Data }) => {
  const { getMicroCopy } = useSiteContext();
  const showMoreText = getMicroCopy(microCopy.GLOBAL_SHOW_MORE);
  const [numberVisible, setNumberVisible] = useState(LOCATIONS_PER_PAGE);

  const locationCards = (
    <Grid container spacing={3}>
      {data.slice(0, numberVisible).map((data, index) => {
        const locationKey = `locations-card-${index}`;
        return (
          <Grid item key={locationKey} xs={12} lg={6} data-testid={locationKey}>
            <ContactDetails data={data} gtmLabel={data.title} />
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
