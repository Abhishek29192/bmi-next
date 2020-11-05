import Section from "@bmi/section";
import ShareWidget from "@bmi/share-widget";
import { graphql } from "gatsby";
import React from "react";

export type Data = {
  __typename: "ShareWidgetSection";
  title: string;
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
      apiUrl: "mailto:?body="
    },
    {
      type: "linkedin" as "linkedin",
      label: "Share on LinkedIn",
      apiUrl: "https://www.linkedin.com/shareArticle?mini=true&url="
    },
    {
      type: "twitter" as "twitter",
      label: "Share on Twitter",
      apiUrl: "https://twitter.com/intent/tweet?url="
    },
    {
      type: "facebook" as "facebook",
      label: "Share on Facebook",
      apiUrl: "https://www.facebook.com/sharer/sharer.php?u="
    },
    {
      type: "pinterest" as "pinterest",
      label: "Share on Pinterest",
      apiUrl: "https://www.pinterest.com/pin/create/button/?url="
    }
  ];

  return (
    <Section backgroundColor="white">
      <ShareWidget
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
