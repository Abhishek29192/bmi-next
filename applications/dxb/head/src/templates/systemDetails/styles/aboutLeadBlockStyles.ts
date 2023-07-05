import { LeadBlock } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";

const PREFIX = "AboutLeadBlock";

export const classes = {
  image: `${PREFIX}-image`,
  inlineLink: `${PREFIX}-inlineLink`,
  description: `${PREFIX}-description`
};

export const StyledLeadBlock = styled(LeadBlock)(({ theme }) => ({
  [`& .${classes.image}`]: {
    height: "80px",
    paddingRight: "10px"
  },
  [`& .${classes.inlineLink}`]: {
    paddingTop: "10px",
    color: "#0072b0",
    "&:hover": {
      color: "#005b8c"
    },
    transition: "color ease-out 0.25s"
  },
  [`& .${classes.description}`]: {
    "&>*:first-of-type": {
      marginTop: 0
    }
  }
  // "@global": {
  //   "[class*=MuiBox-root]": {
  //     padding: 0
  //   }
  // }
}));
