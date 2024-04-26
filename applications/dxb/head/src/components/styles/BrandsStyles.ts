import { styled } from "@mui/material/styles";

import Section from "@bmi-digital/components/section";

export const SectionElement = styled(Section)(({ theme }) => ({
  [":global(.MuiButton-root)"]: {
    padding: "0",
    [theme.breakpoints.up(1440)]: {
      maxWidth: "350px"
    }
  }
}));
