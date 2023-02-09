import { Tabs, tabsClasses } from "@bmi-digital/components";
import { styled } from "@mui/material";

export const ResultListTabPanel = styled(Tabs.TabPanel)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints!.up!("lg")]: {
    width: "33.3333333333%",
    [`&.${tabsClasses.tabPanelBox}`]: {
      paddingRight: 0,
      paddingLeft: 0
    }
  }
}));

export const MapTabPanel = styled(Tabs.TabPanel)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints!.up!("lg")]: {
    width: "66.6666666667%",
    [`&.${tabsClasses.tabPanelBox}`]: {
      paddingRight: 0,
      paddingLeft: 0
    }
  }
}));
