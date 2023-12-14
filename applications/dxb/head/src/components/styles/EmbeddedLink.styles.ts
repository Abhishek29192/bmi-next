import { styled } from "@mui/material/styles";
// import Link from "../Link";

const PREFIX = "EmbeddedLinkStyles";

export const classes = {
  embeddedLink: `${PREFIX}-embeddedLink`
};

export const StyledEmbeddedLink = styled("div")(({ theme }) => ({
  [`.${classes.embeddedLink}`]: {
    margin: "24px 0 !important",
    "&:last-child": {
      marginBottom: "0"
    }
  }
}));
