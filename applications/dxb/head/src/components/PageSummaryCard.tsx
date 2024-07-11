import React from "react";
import AnchorLink from "@bmi-digital/components/anchor-link";
import Typography from "@bmi-digital/components/typography";
import NextLink from "next/link";
import { getPathWithCountryCode } from "../utils/path";
import {
  StyledPageSummaryCard,
  StyledSubtitle
} from "./styles/PageSummaryCard.styles";

type Props = {
  title: string;
  subtitle: string;
  countryCode: string;
  path: string;
};

const PageSummaryCard = ({ title, subtitle, countryCode, path }: Props) => {
  const href = getPathWithCountryCode(countryCode, path).replace(/\/+/gi, "/");
  return (
    <StyledPageSummaryCard>
      <AnchorLink
        component={NextLink}
        href={href}
        gtm={{ id: "cta-click1", action: href, label: title }}
      >
        <Typography noClamp variant="h4">
          {title}
        </Typography>
      </AnchorLink>
      <StyledSubtitle variant="lead">{subtitle}</StyledSubtitle>
    </StyledPageSummaryCard>
  );
};

export default PageSummaryCard;
