import Button from "@bmi-digital/components/button";
import Section from "@bmi-digital/components/section";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";
import FormSection from "../FormSection";
import FieldContainer from "./subcomponents/_FieldContainer";

export const StyledSpinnerContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "100px",
  left: "0",
  width: "100%",
  height: "calc(100% - 194px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.colours.white,
  zIndex: 3,

  [theme.breakpoints.down("md")]: {
    height: "calc(100% - 233px)"
  },

  [theme.breakpoints.down("sm")]: {
    top: "70px",
    height: "calc(100% - 203px)"
  }
}));

export const StyledFieldContainer = styled(FieldContainer)(({ theme }) => ({
  display: "block"
}));

export const StyledPrintReportSection = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  paddingTop: "54px",
  "&>div": {
    width: "564px",
    paddingRight: "24px",
    maxWidth: "55%",

    [theme.breakpoints.down("md")]: {
      width: "100%",
      maxWidth: "unset",
      paddingRight: "0"
    }
  },

  [theme.breakpoints.down("md")]: {
    paddingTop: "30px",
    flexDirection: "column"
  }
}));

export const StyledTypographyHelp = styled(Typography)({
  margin: "24px 0 36px"
});

export const StyledFormSection = styled(FormSection)({
  "&& h2": {
    marginBottom: "24px",
    fontSize: "1.35rem",
    textAlign: "center",

    "&::after": {
      content: "none"
    }
  }
});

export const StyledFormSectionTypographyHelp = styled(Typography)(
  ({ theme }) => ({
    marginBottom: "40px",
    textAlign: "center",

    "& + div": {
      margin: "1rem auto 0"
    }
  })
);

export const StyledNeedHelpSection = styled(Section)(({ theme }) => ({
  ["&&"]: {
    padding: "30px",
    width: "448px",
    maxWidth: "40%",

    [theme.breakpoints.down("md")]: {
      width: "100%",
      maxWidth: "unset",
      padding: "30px 16px",
      marginTop: "32px"
    }
  }
}));

export const StyledNeedHelpSectionTitle = styled(Section.Title)(
  ({ theme }) => ({
    fontSize: "1.35rem",
    marginBottom: "32px",

    "&::after": {
      marginTop: "4px",
      height: "3px"
    }
  })
);

export const StyledResetLinkButton = styled(Button)(({ theme }) => ({
  textDecoration: "underline",
  padding: "0",
  verticalAlign: "unset",
  "&:hover": {
    textDecoration: "underline"
  },

  "&--text:hover": {
    backgroundColor: "unset"
  }
}));
