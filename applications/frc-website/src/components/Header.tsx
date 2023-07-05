import { Link } from "gatsby";
import React from "react";
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
        <Link
          to={
            "/" + (typeof window !== "undefined" ? window.location.search : "")
          }
        >
          <StyledLogo />
        </Link>
        <StyledText variant="h5">Bitumen Flat Roof Estimator</StyledText>
      </StyledContainer>
    </StyledHeader>
  );
};

export default BmiHeader;
