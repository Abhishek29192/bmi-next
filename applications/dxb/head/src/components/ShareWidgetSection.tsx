import Button, { ButtonProps } from "@bmi/button";
import Section from "@bmi/section";
import ShareWidget from "@bmi/share-widget";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import { microCopy } from "../constants/microCopies";
import { useSiteContext } from "./Site";

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

const GTMButton = withGTM<ButtonProps>(Button, {
  label: "accessibilityLabel",
  action: "data-channel"
});

const ShareWidgetSection = ({
  data: {
    __typename,
    title,
    message,
    clipboardSuccessMessage,
    clipboardErrorMessage,
    isLeftAligned,
    ...channels
  },
  hasNoPadding
}: {
  data: Data;
  hasNoPadding?: boolean;
}) => {
  const { getMicroCopy } = useSiteContext();
  const availableChannels = [
    { type: "copy" as "copy", label: getMicroCopy(microCopy.SHARE_COPY) },
    {
      type: "email" as "email",
      label: getMicroCopy(microCopy.SHARE_EMAIL),
      apiUrl: "mailto:?body={{href}}&subject={{message}}"
    },
    {
      type: "linkedin" as "linkedin",
      label: getMicroCopy(microCopy.SHARE_LINKEDIN),
      apiUrl: "https://www.linkedin.com/sharing/share-offsite/?url={{href}}"
    },
    {
      type: "twitter" as "twitter",
      label: getMicroCopy(microCopy.SHARE_TWITTER),
      apiUrl: "https://twitter.com/intent/tweet?text={{message}}&url={{href}}"
    },
    {
      type: "facebook" as "facebook",
      label: getMicroCopy(microCopy.SHARE_FACEBOOK),
      apiUrl:
        "https://www.facebook.com/sharer/sharer.php?u={{href}}&display=popup"
    },
    {
      type: "pinterest" as "pinterest",
      label: getMicroCopy(microCopy.SHARE_PINTEREST),
      apiUrl: "https://www.pinterest.com/pin/create/button/?url={{href}}"
    }
  ];

  return (
    <Section backgroundColor="white" spacing="none" hasNoPadding={hasNoPadding}>
      <ShareWidget
        title={title}
        message={message}
        buttonComponent={(props: ButtonProps) => (
          <GTMButton gtm={{ id: "cta-share1" }} {...props} />
        )}
        clipboardSuccessMessage={
          clipboardSuccessMessage ||
          getMicroCopy(microCopy.SHARE_CLIPBOARD_SUCCESS)
        }
        clipboardErrorMessage={
          clipboardErrorMessage ||
          getMicroCopy(microCopy.SHARE_CLIPBOARD_FAILURE)
        }
        isLeftAligned={isLeftAligned}
        channels={availableChannels.filter(
          (channel) => channels[channel.type] && channel
        )}
      />
    </Section>
  );
};

export default ShareWidgetSection;

export const query = graphql`
  fragment ShareWidgetSectionFragment on ContentfulShareWidgetSection {
    title
    message
    clipboardSuccessMessage
    clipboardErrorMessage
    isLeftAligned
    email
    copy
    linkedin
    twitter
    facebook
    pinterest
  }
`;
