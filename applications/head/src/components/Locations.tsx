import { graphql } from "gatsby";
import React, { useContext, useState } from "react";
import { SiteContext } from "./Site";
import LocationCard, { DetailProps } from "@bmi/location-card";
import RichText from "./RichText";
import Grid from "@bmi/grid";
import Button from "@bmi/button";
import styles from "./styles/Locations.module.scss";
import { Document } from "@contentful/rich-text-types";

export type Data = {
  title: string;
  address: string;
  phoneNumber: string;
  email: string;
  otherInformation: {
    json: Document;
  };
}[];

type Details = readonly [DetailProps, ...DetailProps[]];

const LOCATIONS_PER_PAGE = 6;

const Locations = ({ data }: { data: Data }) => {
  const { getMicroCopy } = useContext(SiteContext);
  const showMoreText = getMicroCopy("global.showMore");
  const [numberVisible, setNumberVisible] = useState(LOCATIONS_PER_PAGE);

  const locationCards = (
    <Grid container spacing={3}>
      {data
        .slice(0, numberVisible)
        .map(
          ({ title, address, phoneNumber, email, otherInformation }, index) => {
            const addressLine: DetailProps[] = address
              ? [
                  {
                    type: "address",
                    text: address,
                    action: {
                      model: "htmlLink",
                      href: `https://maps.google.com/maps?q=${address}`,
                      target: "_blank",
                      rel: "noopener noreferrer"
                    },
                    label: "Address"
                  }
                ]
              : [];
            const phoneNumberLine: DetailProps[] = phoneNumber
              ? [
                  {
                    type: "phone",
                    text: phoneNumber,
                    action: { model: "htmlLink", href: `tel:${phoneNumber}` },
                    label: "Telephone"
                  }
                ]
              : [];
            const emailLine: DetailProps[] = email
              ? [
                  {
                    type: "email",
                    text: email,
                    action: { model: "htmlLink", href: `mailto:${email}` },
                    label: "Email"
                  }
                ]
              : [];

            if (
              !addressLine.length &&
              !phoneNumberLine.length &&
              !emailLine.length
            ) {
              return null;
            }

            // @ts-ignore It doens't realise that there will be at least one.
            const details: Details = [
              ...addressLine,
              ...phoneNumberLine,
              ...emailLine
            ];

            return (
              <Grid item key={index} xs={12} lg={6}>
                <LocationCard
                  title={title}
                  details={details}
                  footNote={
                    otherInformation ? (
                      <RichText document={otherInformation.json} />
                    ) : null
                  }
                />
              </Grid>
            );
          }
        )}
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
    title
    address
    phoneNumber
    email
    otherInformation {
      json
    }
  }
`;
