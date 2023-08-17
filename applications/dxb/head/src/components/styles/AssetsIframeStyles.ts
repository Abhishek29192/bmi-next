import { styled } from "@mui/material/styles";

export const AssetsIframeElement = styled("iframe")(({ theme }) => ({
  width: "100%",
  height: "500px",
  border: "none",
  marginTop: "32px",
  marginBottom: "48px",

  [theme.breakpoints.up("lg")]: {
    height: "600px"
  }
}));
