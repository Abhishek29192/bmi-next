import React from "react";
import { StyledContainer } from "./styles/ContainerStyles";

type Props = {
  children?: React.ReactNode;
};

const BMIContainer = ({ children }: Props) => {
  return <StyledContainer>{!!children && children}</StyledContainer>;
};

export default BMIContainer;
