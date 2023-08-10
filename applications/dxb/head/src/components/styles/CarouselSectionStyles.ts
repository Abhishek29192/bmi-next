import { styled } from "@mui/material/styles";

import { Section, Button } from "@bmi-digital/components";

export const SectionElement = styled(Section)(() => ({
  overflow: "hidden",

  "@media (max-width: 769px)": {
    "&.video-preview-image": {
      maxHeight: "400px",
      height: "calc(100vw - 32px)"
    }
  }
}));

export const LinkElement = styled(Button)(() => ({
  marginTop: "24px"
}));
