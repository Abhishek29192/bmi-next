import { LinkProps } from "@mui/material";
import React from "react";
import withGTM from "../../../../utils/google-tag-manager";
import { Service } from "../../index";
import { getSocialMediaGtm } from "../../utils/getSocialMediaGtm";
import { Item, Root, StyledIcon, StyledLink } from "./styles";

export interface Props {
  "data-testid"?: string;
  service: Service;
}

export const WithGtmLink = withGTM<LinkProps>(StyledLink);

export const SocialMediaLinks = ({
  "data-testid": dataTestId,
  service
}: Props) => {
  const { facebook, instagram, linkedIn, twitter } = service;

  return (
    <Root data-testid={dataTestId ?? "social-media-links"}>
      {facebook && (
        <Item>
          <WithGtmLink
            aria-label="facebook"
            href={`https://www.facebook.com/${facebook}`}
            gtm={getSocialMediaGtm({ channel: "facebook", service })}
          >
            <StyledIcon name="Facebook" />
          </WithGtmLink>
        </Item>
      )}
      {twitter && (
        <Item>
          <WithGtmLink
            aria-label="twitter"
            href={`https://www.twitter.com/${twitter}`}
            gtm={getSocialMediaGtm({ channel: "twitter", service })}
          >
            <StyledIcon name="Twitter" />
          </WithGtmLink>
        </Item>
      )}
      {instagram && (
        <Item>
          <WithGtmLink
            aria-label="instagram"
            href={`https://www.instagram.com/${instagram}`}
            gtm={getSocialMediaGtm({ channel: "instagram", service })}
          >
            <StyledIcon name="Instagram" />
          </WithGtmLink>
        </Item>
      )}
      {linkedIn && (
        <Item>
          <WithGtmLink
            aria-label="linkedIn"
            href={`https://www.linkedin.com/${linkedIn}`}
            gtm={getSocialMediaGtm({ channel: "linkedIn", service })}
          >
            <StyledIcon name="LinkedIn" />
          </WithGtmLink>
        </Item>
      )}
    </Root>
  );
};
