import React from "react";
import AnchorLink from "@bmi-digital/components/anchor-link";
import {
  StyledHeader,
  StyledContainer,
  StyledLogo,
  StyledText
} from "./styles/HeaderStyles";

const BmiHeader = () => {
  return (
    <StyledHeader elevation={3} square>
      <StyledContainer>
        <AnchorLink
          href={
            "/" + (typeof window !== "undefined" ? window.location.search : "")
          }
        >
          <StyledLogo />
        </AnchorLink>
        <StyledText variant="h5">Bitumen Flat Roof Estimator</StyledText>
      </StyledContainer>
    </StyledHeader>
  );
};

export default BmiHeader;
