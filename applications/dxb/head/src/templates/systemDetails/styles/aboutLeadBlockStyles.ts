import { LeadBlock } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";

const PREFIX = "AboutLeadBlock";

export const classes = {
  guaranteesAndAwardsAsset: `${PREFIX}-guaranteesAndAwardsAsset`
};

export const StyledLeadBlock = styled(LeadBlock)(({ theme }) => ({
  color: theme.colours.inter,
  [`& .${classes.guaranteesAndAwardsAsset}`]: {
    "& .image": {
      height: "80px",
      paddingRight: "10px"
    },
    "&.inline-link": {
      paddingTop: "10px",
      color: "#0072b0",
      "&:hover": {
        color: "#005b8c"
      },
      transition: "color ease-out 0.25s"
    }
  }
  // "@global": {
  //   "[class*=MuiBox-root]": {
  //     padding: 0
  //   }
  // }
}));
