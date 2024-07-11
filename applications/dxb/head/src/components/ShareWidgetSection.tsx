import Section from "@bmi-digital/components/section";
import ShareWidget, {
  ShareWidgetProps
} from "@bmi-digital/components/share-widget";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import { useSiteContext } from "./Site";
import type { GetMicroCopy } from "./MicroCopy";

export type Data = {
  __typename: "ShareWidgetSection";
  title: string;
  message: string | null;
  clipboardSuccessMessage: string | null;
  clipboardErrorMessage: string | null;
  isLeftAligned: boolean | null;
  copy: boolean | null;
  email: boolean | null;
  facebook: boolean | null;
  linkedin: boolean | null;
  pinterest: boolean | null;
  twitter: boolean | null;
};

export type Props = {
  data: Data;
  hasNoPadding?: boolean;
  "data-testid"?: string;
};

const createChannelData = (
  getMicroCopy: GetMicroCopy,
  data: Props["data"]
): ShareWidgetProps["channels"] => {
  const { copy, email, facebook, linkedin, pinterest, twitter } = data;

  const socialMediaTypes = [
    { type: "copy", value: copy, microCopyKey: microCopy.SHARE_COPY },
    { type: "email", value: email, microCopyKey: microCopy.SHARE_EMAIL },
    {
      type: "linkedin",
      value: linkedin,
      microCopyKey: microCopy.SHARE_LINKEDIN
    },
    { type: "twitter", value: twitter, microCopyKey: microCopy.SHARE_TWITTER },
    {
      type: "facebook",
      value: facebook,
      microCopyKey: microCopy.SHARE_FACEBOOK
    },
    {
      type: "pinterest",
      value: pinterest,
      microCopyKey: microCopy.SHARE_PINTEREST
    }
  ];

  return socialMediaTypes
    .filter(({ value }) => value)
    .map(({ type, microCopyKey }) => ({
      type,
      label: getMicroCopy(microCopyKey),
      gtm: {
        id: "cta-share1",
        label: getMicroCopy(microCopyKey),
        action: type
      }
    })) as ShareWidgetProps["channels"];
};

const ShareWidgetSection = ({
  data,
  hasNoPadding,
  "data-testid": dataTestId
}: Props) => {
  const {
    title,
    message,
    clipboardSuccessMessage,
    clipboardErrorMessage,
    isLeftAligned
  } = data;
  const { getMicroCopy } = useSiteContext();

  return (
    <Section
      backgroundColor="white"
      spacing="none"
      hasNoPadding={hasNoPadding}
      data-testid={dataTestId || "share-widget-section"}
    >
      <ShareWidget
        title={title}
        message={message}
        clipboardSuccessMessage={
          clipboardSuccessMessage ||
          getMicroCopy(microCopy.SHARE_CLIPBOARD_SUCCESS)
        }
        clipboardErrorMessage={
          clipboardErrorMessage ||
          getMicroCopy(microCopy.SHARE_CLIPBOARD_FAILURE)
        }
        isLeftAligned={isLeftAligned}
        channels={createChannelData(getMicroCopy, data)}
      />
    </Section>
  );
};

export default ShareWidgetSection;
