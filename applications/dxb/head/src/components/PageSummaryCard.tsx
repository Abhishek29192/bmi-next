import AnchorLink from "@bmi-digital/components/anchor-link";
import Typography from "@bmi-digital/components/typography";
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

const PageSummaryCard = ({ title, subtitle, countryCode, path }: Props) => {
  return (
    <StyledPageSummaryCard>
      <AnchorLink
        action={getClickableActionFromUrl({
          linkedPage: { path },
          countryCode,
          label: title
        })}
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
