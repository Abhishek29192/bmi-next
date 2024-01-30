import Tabs from "@bmi-digital/components/tabs";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";
import AssetsIframe from "../AssetsIframe";

const PREFIX = "ProductLeadBlockStyles";

export const classes = {
  "inline-link": `${PREFIX}-inline-link`
};

export const StyledProductLeadBlock = styled("div")(({ theme }) => ({
  ":global": {
    "[class*='MuiBox-root']": {
      padding: "0px"
    }
  },
  [`.${classes["inline-link"]}`]: {
    paddingTop: "10px",
    color: "#0072b0",
    "&:hover": {
      color: "#005b8c"
    },
    transition: "color ease-out 0.25s"
  }
}));

export const StyledProductDescription = styled(Typography)(({ theme }) => ({
  "& > *:first-of-type": {
    marginTop: "0"
  }
}));

export const StyledImagesContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "18px"
}));

export const StyledImage = styled("img")(({ theme }) => ({
  height: "100px",
  [theme.breakpoints.down("lg")]: {
    height: "80px"
  }
}));

export const StyledDocumentSpan = styled("span")(({ theme }) => ({
  paddingTop: "10px",
  paddingRight: "10px",
  display: "inline-block"
}));

export const StyledDocumentLibrary = styled("div")(({ theme }) => ({
  paddingTop: "32px"
}));

export const StyledTabPanel = styled(Tabs.TabPanel)(({ theme }) => ({
  paddingTop: "24px"
}));

export const StyledProductLeadBlockTitle = styled(Typography)(({ theme }) => ({
  marginBottom: "24px"
}));

export const StyledProductLeadTabIFrame = styled(AssetsIframe)(({ theme }) => ({
  height: "600px",
  [theme.breakpoints.up("lg")]: {
    height: "800px"
  }
}));
