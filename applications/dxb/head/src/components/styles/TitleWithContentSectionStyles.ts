import Grid from "@bmi-digital/components/grid";
import { styled } from "@mui/material/styles";

const PREFIX = "TitleWithContent";
export const classes = {
  richText: `${PREFIX}-richText`
};

export const GridContainer = styled(Grid)({
  margin: 0,
  flexDirection: "column",
  [`.${classes.richText}`]: {
    maxWidth: "100%"
  }
});
