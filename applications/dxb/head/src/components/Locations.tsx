import { graphql } from "gatsby";
import React, { useState } from "react";
import { Grid } from "@bmi/components";
import { Button } from "@bmi/components";
import { microCopy } from "../constants/microCopies";
import { useSiteContext } from "./Site";
import styles from "./styles/Locations.module.scss";
import ContactDetails, { Data as ContactDetailsData } from "./ContactDetails";

export type Data = ContactDetailsData[];

const LOCATIONS_PER_PAGE = 6;

const Locations = ({ data }: { data: Data }) => {
  const { getMicroCopy } = useSiteContext();
  const showMoreText = getMicroCopy(microCopy.GLOBAL_SHOW_MORE);
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
