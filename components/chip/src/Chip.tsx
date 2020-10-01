import React from "react";
import { Chip as MaterialChip } from "@material-ui/core";
import ColorPair, { Colors } from "@bmi/color-pair";

type Props = {
  children: React.ReactNode;
  theme?: Colors;
  onClick?: () => void;
};

const Chip = ({ children, theme = "pearl", ...rest }: Props) => {
  return (
    <ColorPair theme={theme}>
      <MaterialChip label={children} {...rest} />
    </ColorPair>
  );
};

export default Chip;
