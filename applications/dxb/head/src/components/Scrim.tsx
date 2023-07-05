import React from "react";
import { StyledScrim, classes } from "./styles/Scrim.styles";

const Scrim = ({
  children,
  theme
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
}) => (
  <StyledScrim className={[classes[`scrim--${theme}`]].join(" ")}>
    {children}
  </StyledScrim>
);

export default Scrim;
