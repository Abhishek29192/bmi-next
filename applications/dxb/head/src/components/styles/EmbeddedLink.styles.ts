import { styled } from "@mui/material/styles";

const PREFIX = "EmbeddedLinkStyles";

export const classes = {
  embeddedLink: `${PREFIX}-embeddedLink`
};

// Ideally would be a styled ButtonLink, but causes a recursive dependency
export const StyledEmbeddedLink = styled("div")({
  [`.${classes.embeddedLink}`]: {
    margin: "24px 0 !important",
    "&:last-child": {
      marginBottom: "0"
    }
  }
});
