import LocationDetails, {
  LocationDetailProps
} from "@bmi-digital/components/location-details";
import { graphql } from "gatsby";
import React from "react";
import { microCopy } from "@bmi/microcopies";
import { GetMicroCopy } from "./MicroCopy";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";

export type Data = {
  __typename: "ContentfulContactDetails";
  title: string;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
  otherInformation: RichTextData | null;
};

type Details = readonly [LocationDetailProps, ...LocationDetailProps[]];

export const getDetails = (
  getMicroCopy: GetMicroCopy,
  address: string | null,
  phoneNumber: string | null,
  email: string | null,
  gtmLabel?: string
) => {
  const addressLine: [LocationDetailProps] | undefined = address
    ? [
        {
          type: "address",
          text: address,
          action: {
            href: `https://maps.google.com/maps?q=${address}`,
            external: true,
            gtm: {
              id: "cta-click1",
              action: `https://maps.google.com/maps?q=${address}`,
              label: gtmLabel ? `${gtmLabel} - ${address}` : address
            }
          },
          label: getMicroCopy(microCopy.GLOBAL_ADDRESS)
        }
      ]
    : undefined;
  const phoneNumberLine: [LocationDetailProps] | undefined = phoneNumber
    ? [
        {
          type: "phone",
          text: phoneNumber,
          action: {
            href: `tel:${phoneNumber}`,
            gtm: {
              id: "cta-click1",
              action: `tel:${phoneNumber}`,
              label: gtmLabel ? `${gtmLabel} - ${phoneNumber}` : phoneNumber
            }
          },
          label: getMicroCopy(microCopy.GLOBAL_TELEPHONE)
        }
      ]
    : undefined;
  const emailLine: [LocationDetailProps] | undefined = email
    ? [
        {
          type: "email",
          text: email,
          action: {
            href: `mailto:${email}`,
            gtm: {
              id: "cta-click1",
              action: `mailto:${email}`,
              label: gtmLabel ? `${gtmLabel} - ${email}` : email
            }
          },
          label: getMicroCopy(microCopy.GLOBAL_EMAIL)
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
  data,
  gtmLabel
}: {
  data: Data;
  gtmLabel?: string;
}): React.ReactElement => {
  const { title, address, phoneNumber, email, otherInformation } = data;
  const { getMicroCopy } = useSiteContext();
  const details = getDetails(
    getMicroCopy,
    address,
    phoneNumber,
    email,
    gtmLabel
  );

  return (
    <LocationDetails
      title={title}
      details={details}
      footNote={
        otherInformation ? (
          <RichText document={otherInformation} hasNoBottomMargin />
        ) : undefined
      }
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
