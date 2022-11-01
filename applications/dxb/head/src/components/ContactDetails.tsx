import {
  AnchorLink,
  AnchorLinkProps,
  LocationCard,
  LocationCardDetailProps,
  MicroCopy
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
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

type Details = readonly [LocationCardDetailProps, ...LocationCardDetailProps[]];

export const getDetails = (
  address: string | null,
  phoneNumber: string | null,
  email: string | null
): Details | undefined => {
  const addressLine: [LocationCardDetailProps] | undefined = address
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
  const phoneNumberLine: [LocationCardDetailProps] | undefined = phoneNumber
    ? [
        {
          type: "phone",
          text: phoneNumber,
          action: { model: "htmlLink", href: `tel:${phoneNumber}` },
          label: <MicroCopy path="global.telephone" />
        }
      ]
    : undefined;
  const emailLine: [LocationCardDetailProps] | undefined = email
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
    return undefined;
  }
  return [
    ...(addressLine || []),
    ...(phoneNumberLine || []),
    ...(emailLine || [])
  ] as unknown as Details; // Required to force the type as TS doesn't understand that there will always be at least 1 element
};

const IntegratedLocationCard = ({
  anchorComponent,
  data,
  isFlat,
  gtmLabel
}: {
  data: Data;
  isFlat?: boolean;
  anchorComponent?: React.ComponentType<any>; // TODO
  gtmLabel?: string;
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
            action: props?.action?.href,
            label:
              gtmLabel &&
              `${gtmLabel}${props?.children ? ` - ${props.children}` : ""}`
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
