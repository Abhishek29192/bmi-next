import { styled } from "@mui/material/styles";
import { Grid } from "@bmi-digital/components";

const PREFIX = "SearchPageBlock";

export const classes = {
  content: `${PREFIX}-content`,
  "content-search": `${PREFIX}-content-search`,
  "content-card": `${PREFIX}-content-card`
};

export const StyledSearchPageGrid = styled(Grid)(({ theme }) => ({
  [`.${classes.content}`]: {
    marginBottom: "32px"
  },

  [`.${classes["content-card"]}`]: {
    marginBottom: "32px",
    marginTop: "0",
    [theme.breakpoints.up("lg")]: {
      marginTop: "24px"
    }
  },
  [`.${classes["content-search"]}`]: {
    marginBottom: "32px",
    display: "none",
    [theme.breakpoints.up("lg")]: {
      display: "block"
    }
  }
}));
