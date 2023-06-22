import { Grid, Typography } from "@bmi-digital/components";
import React from "react";
import {
  StyledOptionCardContainer,
  StyledTitle
} from "./styles/OptionCardStyles";

const OptionCard = ({ title, description, children }: any) => (
  <StyledOptionCardContainer>
    <Grid container spacing={3}>
      <Grid xs={12} md={6}>
        <StyledTitle variant={"h4"} hasUnderline>
          {title}
        </StyledTitle>
        <Typography variant={"body2"}>{description}</Typography>
      </Grid>
      <Grid
        container
        xs={12}
        md={6}
        direction={"column"}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Grid>
    </Grid>
  </StyledOptionCardContainer>
);

export default OptionCard;
