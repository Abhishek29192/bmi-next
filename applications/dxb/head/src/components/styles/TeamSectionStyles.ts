import { Section, tabsClasses } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";

type Classes = {
  [key: string]: string;
};

export const PREFIX = "TeamSection";

export const classes: Classes = {
  white: `${PREFIX}-white`,
  alabaster: `${PREFIX}-alabaster`,
  tabs: `${PREFIX}-tabs`,
  tabPanel: `${PREFIX}-tabPanel`,
  description: `${PREFIX}-description`
};

export const StyledSection = styled(Section)(({ theme }) => ({
  [`&.${classes.white}`]: {
    backgroundColor: theme.colours.white,
    [`.${classes.tabs} > .${tabsClasses.tabsBar}`]: {
      backgroundColor: theme.colours.alabaster
    },
    [`.${classes.tabPanel} > div`]: {
      backgroundColor: theme.colours.white
    }
  },
  [`&.${classes.alabaster}`]: {
    backgroundColor: theme.colours.alabaster,
    [`.${classes.tabs} > .${tabsClasses.tabsBar}`]: {
      backgroundColor: theme.colours.white
    },
    [`.${classes.tabPanel} > div`]: {
      backgroundColor: theme.colours.alabaster
    }
  },
  [`& .${classes.description}`]: {
    marginBottom: "24px"
  }
}));

export const TeamCategoryContainer = styled("div")({
  margin: "0 auto",
  paddingBottom: "24px",
  width: "100%",

  "&:last-of-type": {
    paddingBottom: 0
  }
});
