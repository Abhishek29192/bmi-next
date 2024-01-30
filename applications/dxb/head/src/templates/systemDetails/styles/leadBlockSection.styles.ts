import Section from "@bmi-digital/components/section";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";
import GoodBetterBestIndicator from "../../../components/GoodBetterBestIndicator";

const PREFIX = "SystemDetailsLeadBlockSectionStyles";

export const classes = {
  ctaContainer: `${PREFIX}-ctaContainer`,
  brandLogo: `${PREFIX}-ctaContainer`,
  quotationBtn: `${PREFIX}-quotationBtn`,
  card: `${PREFIX}-card`,
  iconList: `${PREFIX}-iconList`,
  backToYourSelectionBtn: `${PREFIX}-backToYourSelectionBtn`
};

export const StyledSystemDetailsLeadBlockSection = styled(Section)(
  ({ theme }) => ({
    paddingTop: "0",
    [`.${classes.ctaContainer}`]: {
      display: "flex",
      alignItems: "flex-start",
      flexDirection: "column",
      [theme.breakpoints.up("lg")]: {
        flexDirection: "row",
        alignItems: "center"
      }
    },
    [`.${classes.brandLogo}`]: {
      fill: theme.colours.white,
      maxHeight: "50px",
      width: "auto"
    },
    [`.${classes.quotationBtn}`]: {
      marginLeft: "0"
    },
    [`.${classes.card}`]: {
      "& > div": {
        backgroundColor: theme.colours.alabaster
      }
    },
    [`.${classes.iconList}`]: {
      "& > [class*='IconList']": {
        "&:first-of-type": {
          marginTop: "0"
        },
        "&:last-child": {
          marginBottom: "0"
        }
      }
    },
    [`.${classes.backToYourSelectionBtn}`]: {
      marginRight: "20px",
      [theme.breakpoints.down("lg")]: {
        paddingLeft: "0",
        marginBottom: "24px"
      }
    }
  })
);

export const StyledTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    "&&::after": {
      marginBottom: "18px"
    }
  }
}));

export const StyledGoodBetterBestIndicator = styled(GoodBetterBestIndicator)({
  borderRadius: "3px",
  width: "max-content"
});

export const Description = styled(Typography)({
  marginTop: "24px"
});
