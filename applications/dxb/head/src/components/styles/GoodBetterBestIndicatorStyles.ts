import { styled } from "@mui/material/styles";
import { Typography } from "@bmi-digital/components";
import Icon from "../Icon";

interface GoodBetterBestClassMap {
  [key: string]: string;
}

const PREFIX = "GoodBetterBestIndicator";
export const classes: GoodBetterBestClassMap = {
  good: `${PREFIX}-good`,
  better: `${PREFIX}-better`,
  best: `${PREFIX}-best`
};

export const IndicatorWrapper = styled("div")(({ theme }) => ({
  color: theme.colours.white,
  padding: "6px 12px",
  display: "flex",
  alignItems: "center",
  borderTopRightRadius: "3px",
  borderBottomRightRadius: "3px",

  [`&.${classes.good}`]: {
    backgroundColor: theme.colours.teal400
  },

  [`&.${classes.better}`]: {
    backgroundColor: theme.colours.purple400
  },

  [`&.${classes.best}`]: {
    backgroundColor: theme.colours.orange400
  }
}));

export const StyledTypography = styled(Typography)({
  fontSize: "14px",
  fontWeight: 700,
  textTransform: "uppercase"
});

export const StyledIcon = styled(Icon)({
  width: "16px",
  height: "16px",
  marginRight: "6px"
});
