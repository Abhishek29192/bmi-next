import Button from "@bmi-digital/components/button";
import Section from "@bmi-digital/components/section";
import { styled } from "@mui/material/styles";

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
