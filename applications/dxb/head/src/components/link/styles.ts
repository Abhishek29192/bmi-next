import AnchorLink from "@bmi-digital/components/anchor-link";
import Button from "@bmi-digital/components/button";
import { styled } from "@mui/material/styles";

const PREFIX = "Link";

export const classes = {
  branded: `${PREFIX}-hasBrand`
};

export const StyledAnchorLink = styled(AnchorLink)(({ theme }) => ({
  [`&.${classes.branded}`]: {
    background: theme.colours.inter,
    borderColor: theme.colours.inter,
    color: theme.colours.white
  }
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  [`&.${classes.branded}`]: {
    background: theme.colours.inter,
    borderColor: theme.colours.inter,
    color: theme.colours.white
  }
}));

export const StyledLinkDialog = styled("div")(({ theme }) => ({
  marginBottom: "2rem",
  maxHeight: "100%",
  overflow: "auto",
  padding: "0 2rem"
}));
