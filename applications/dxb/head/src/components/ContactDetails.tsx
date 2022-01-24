import React from "react";
import { graphql } from "gatsby";
import AnchorLink, { Props as AnchorLinkProps } from "@bmi/anchor-link";
import LocationCard, { DetailProps } from "@bmi/location-card";
import MicroCopy from "@bmi/micro-copy";
import withGTM from "../utils/google-tag-manager";
import RichText, { RichTextData } from "./RichText";

export type Data = {
  __typename: "ContentfulContactDetails";
  title: string;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
  otherInformation: RichTextData | null;
};

type Details = Array<DetailProps>;

export const getDetails = (
  address: string | null,
  phoneNumber: string | null,
  email: string | null
): Details => {
  const addressLine: [DetailProps] | undefined = address
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
          label: <MicroCopy path="global.address" />
        }
      ]
    : undefined;
  const phoneNumberLine: [DetailProps] | undefined = phoneNumber
    ? [
        {
          type: "phone",
          text: phoneNumber,
          action: { model: "htmlLink", href: `tel:${phoneNumber}` },
          label: <MicroCopy path="global.telephone" />
        }
      ]
    : undefined;
  const emailLine: [DetailProps] | undefined = email
    ? [
        {
          type: "email",
          text: email,
          action: { model: "htmlLink", href: `mailto:${email}` },
          label: <MicroCopy path="global.email" />
        }
      ]
    : undefined;

  if (!addressLine && !phoneNumberLine && !emailLine) {
    return null;
  }
  return [
    ...(addressLine || []),
    ...(phoneNumberLine || []),
    ...(emailLine || [])
  ];
};

const IntegratedLocationCard = ({
  anchorComponent,
  data,
  isFlat
}: {
  data: Data;
  isFlat?: boolean;
  anchorComponent?: React.ComponentType<any>; // TODO
}): React.ReactElement => {
  const { title, address, phoneNumber, email, otherInformation } = data;
  const details = getDetails(address, phoneNumber, email);

  const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink, {
    label: "children"
  });

  return (
    <LocationCard
      title={title}
      details={details}
      footNote={
        otherInformation ? <RichText document={otherInformation} /> : null
      }
      isFlat={isFlat}
      anchorComponent={(props: AnchorLinkProps) => (
        <GTMAnchorLink
          gtm={{
            id: "cta-click1",
            action: props?.action?.href
          }}
          {...props}
        />
      )}
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
      ...RichTextFragment
    }
  }
`;
