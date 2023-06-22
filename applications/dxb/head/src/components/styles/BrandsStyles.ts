import { styled } from "@mui/material/styles";

import { Section } from "@bmi-digital/components";

export const SectionElement = styled(Section)(() => ({
  [":global(.MuiButton-root)"]: {
    padding: "0",

    "@media (min-width: 1440px)": {
      maxWidth: "350px"
    }
  }
}));
