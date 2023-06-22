import { styled } from "@mui/material/styles";

import { Typography } from "@bmi-digital/components";

export const CheckboxGroupComponent = styled(Typography)(() => ({
  position: "relative",

  ["& > span"]: {
    position: "absolute",
    top: "0",
    left: "-15px"
  }
}));
