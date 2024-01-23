import Section from "@bmi-digital/components/section";
import { styled } from "@mui/material/styles";
import ButtonLink from "../link/ButtonLink";

export const SectionElement = styled(Section)(({ theme }) => ({
  overflow: "hidden",
  [theme.breakpoints.down(769)]: {
    "&.video-preview-image": {
      maxHeight: "400px",
      height: "calc(100vw - 32px)"
    }
  }
}));

export const LinkElement = styled(ButtonLink)({
  marginTop: "24px"
});
