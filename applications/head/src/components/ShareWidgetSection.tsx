import Section from "@bmi/section";
import ShareWidget from "@bmi/share-widget";
import { graphql } from "gatsby";
import React from "react";

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

const ShareWidgetSection = ({
  data: {
    __typename,
    title,
    message,
    clipboardSuccessMessage,
    clipboardErrorMessage,
    isLeftAligned,
    ...channels
  }
}: {
  data: Data;
}) => {
  const availableChannels = [
    { type: "copy" as "copy", label: "Copy to clipboard" },
    {
      type: "email" as "email",
      label: "Share by email", // @todo: Microcopy
      apiUrl: "mailto:?body={{href}}&subject={{message}}"
    },
    {
      type: "linkedin" as "linkedin",
      label: "Share on LinkedIn",
      apiUrl: "https://www.linkedin.com/sharing/share-offsite/?url={{href}}"
    },
    {
      type: "twitter" as "twitter",
      label: "Share on Twitter",
      apiUrl: "https://twitter.com/intent/tweet?text={{message}}&url={{href}}"
    },
    {
      type: "facebook" as "facebook",
      label: "Share on Facebook",
      apiUrl:
        "https://www.facebook.com/sharer/sharer.php?u={{href}}&display=popup"
    },
    {
      type: "pinterest" as "pinterest",
      label: "Share on Pinterest",
      apiUrl: "https://www.pinterest.com/pin/create/button/?url={{href}}"
    }
  ];

  return (
    <Section backgroundColor="white" spacing="none">
      <ShareWidget
        title={title}
        message={message}
        clipboardSuccessMessage={clipboardSuccessMessage}
        clipboardErrorMessage={clipboardErrorMessage}
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
