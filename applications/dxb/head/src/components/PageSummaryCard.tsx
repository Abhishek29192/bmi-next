import { AnchorLink, Typography } from "@bmi-digital/components";
import React from "react";
import { getClickableActionFromUrl } from "./Link";
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

const PageSummaryCard = ({ title, subtitle, countryCode, path }: Props) => (
  <StyledPageSummaryCard>
    <AnchorLink
      action={getClickableActionFromUrl(
        { path },
        null,
        countryCode,
        undefined,
        title
      )}
    >
      <Typography noClamp variant="h4">
        {title}
      </Typography>
    </AnchorLink>
    <StyledSubtitle variant="lead">{subtitle}</StyledSubtitle>
  </StyledPageSummaryCard>
);

export default PageSummaryCard;
