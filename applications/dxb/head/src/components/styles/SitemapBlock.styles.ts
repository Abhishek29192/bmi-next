import { styled } from "@mui/material/styles";
import { Typography } from "@bmi-digital/components";

const PREFIX = "SitemapBlock";

export const classes = {
  child: `${PREFIX}-child`
};

export const StyledSitemapBlock = styled("div")(({ theme }) => ({
  [`& .${classes.child}`]: {
    paddingLeft: "18px"
  }
}));

export const StyledSitemapItem = styled(Typography)(({ theme }) => ({
  marginBottom: "16px"
}));
