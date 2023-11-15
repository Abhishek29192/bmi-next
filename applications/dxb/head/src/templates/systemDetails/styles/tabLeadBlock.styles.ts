import Tabs from "@bmi-digital/components/tabs";
import { styled } from "@mui/material/styles";
import AssetsIframe from "../../../components/AssetsIframe";

export const StyledSDPTabLeadBlock = styled(Tabs)(({ theme }) => ({
  ":global": {
    "[class*='MuiBox-root']": {
      paddingTop: "0"
    },
    "[class*='Section-module']": {
      [theme.breakpoints.down("xl")]: {
        paddingTop: "48px"
      }
    },
    "[class*='MuiGrid2-root']": {
      marginTop: "0",
      paddingTop: "0",
      paddingBottom: "0"
    },
    "[class*='TabsBar'] [class*='MuiContainer-root']": {
      [theme.breakpoints.down("xl")]: {
        paddingLeft: "24px",
        paddingRight: "24px"
      }
    }
  }
}));

export const StyledSDPTabLeadBlockAssetIframe = styled(AssetsIframe)(
  ({ theme }) => ({
    marginTop: "0"
  })
);
