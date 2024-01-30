import Typography from "@bmi-digital/components/typography";
import React from "react";
import {
  StyledDescription,
  StyledDescriptionCard,
  StyledHeader
} from "./styles/DescriptionCardStyles";

const DescriptionCard = ({ title, icon: StyledIcon, children }: any) => (
  <StyledDescriptionCard>
    <StyledHeader>
      <StyledIcon />
      <Typography variant={"h6"} hasUnderline>
        {title}
      </Typography>
    </StyledHeader>
    <StyledDescription variant={"body1"}>{children}</StyledDescription>
  </StyledDescriptionCard>
);

export default DescriptionCard;
