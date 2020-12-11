import React from "react";
import { graphql } from "gatsby";
import LocationCard, { DetailProps } from "@bmi/location-card";
import RichText, { Document } from "./RichText";

export type Data = {
  __typename: "ContentfulContactDetails";
  title: string;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
  otherInformation: {
    json: Document;
  } | null;
};

type Details = readonly [DetailProps, ...DetailProps[]];

export const getDetails = (
  address: string,
  phoneNumber: string,
  email: string
): Details => {
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

  if (!addressLine.length && !phoneNumberLine.length && !emailLine.length) {
    return null;
  }
  // @ts-ignore It doens't realise that there will be at least one.
  return [...addressLine, ...phoneNumberLine, ...emailLine];
};

const IntegratedLocationCard = ({
  data,
  isFlat
}: {
  data: Data;
  isFlat?: boolean;
}) => {
  const { title, address, phoneNumber, email, otherInformation } = data;
  const details = getDetails(address, phoneNumber, email);

  return (
    <LocationCard
      title={title}
      details={details}
      footNote={
        otherInformation ? <RichText document={otherInformation.json} /> : null
      }
      isFlat={isFlat}
    />
  );
};

export default IntegratedLocationCard;

export const query = graphql`
  fragment ContactDetailsFragment on ContentfulContactDetails {
    __typename
    title
    address
    phoneNumber
    email
    otherInformation {
      json
    }
  }
`;
