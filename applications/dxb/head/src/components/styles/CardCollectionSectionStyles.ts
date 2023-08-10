import { styled } from "@mui/material/styles";
import { AnchorLink, Grid, Typography } from "@bmi-digital/components";
import ButtonBase from "@mui/material/ButtonBase";

const PREFIX = "CardCollectionSectionStyles";

export const classes = {
  link: `${PREFIX}-link`,
  hidden: `${PREFIX}-hidden`
};

export const CardCollectionSectionContainer = styled("div")(({ theme }) => ({
  [`& .${classes.link}`]: {
    marginTop: "60px"
  },

  [`& .${classes.hidden}`]: {
    position: "absolute",
    top: "-9999px",
    left: "-9999px"
  }
}));

export const StyledButtonBaseTitle = styled(ButtonBase)(() => ({
  fontFamily: "Effra Bold",
  fontSize: "1.35rem",
  lineHeight: "1.2",
  textAlign: "left"
}));

export const StyledGroupChips = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  margin: "24px 0 37px"
}));

export const StyledChips = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  marginRight: "14px",
  marginBottom: "11px"
}));

export const StyledClearAllButton = styled(AnchorLink)(() => ({
  height: "42px",
  fontSize: "16px",
  marginBottom: "11px",
  marginLeft: "5px"
}));

export const StyledTitle = styled(Typography)(() => ({
  marginBottom: "24px"
}));

export const StyledShowMoreGrid = styled(Grid)(() => ({
  textAlign: "center"
}));
