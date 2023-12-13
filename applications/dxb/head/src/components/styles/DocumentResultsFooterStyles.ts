import Button from "@bmi-digital/components/button";
import DownloadList from "@bmi-digital/components/download-list";
import ErrorIcon from "@bmi-digital/components/icon/Error";
import Pagination from "@bmi-digital/components/pagination";
import Typography from "@bmi-digital/components/typography";
import { buttonClasses } from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";
import RecaptchaPrivacyLinks from "../RecaptchaPrivacyLinks";

const PREFIX = "documentResultsFooter";

export const classes = {
  stickyContainer: `${PREFIX}-stickyContainer`,
  totalSizeValue: `${PREFIX}-totalSizeValue`,
  totalSizeExceeded: `${PREFIX}-totalSizeExceeded`,
  recaptcha: `${PREFIX}-recaptcha`
};

export const DocumentResultsFooterContainer = styled("div")(({ theme }) => ({
  textAlign: "right",
  fontSize: "1rem",

  [`.${classes.recaptcha}`]: {
    marginTop: "1rem"
  },

  [`${theme.breakpoints.up("sm")} and ${theme.breakpoints.down("lg")}`]: {
    margin: "0 -8px"
  }
}));

export const StyledPagination = styled(Pagination)({
  marginTop: "32px",
  "& ul": {
    justifyContent: "flex-end"
  }
});

export const ResetSelectionBtn = styled(DownloadList.Clear)(({ theme }) => ({
  marginLeft: "18px",
  display: "inline-block",

  "&:disabled": {
    color: alpha(theme.colours.interDark, 0.3),
    "&:hover": {
      backgroundColor: "unset"
    }
  }
}));

export const StyledRecaptcha = styled(RecaptchaPrivacyLinks)({
  fontSize: "0.8rem",
  textAlign: "right"
});

export const StickyContainer = styled("div")<{ hasScrollGutter: boolean }>(
  ({ theme, hasScrollGutter }) => ({
    position: "sticky",
    padding: "24px 0",
    bottom: 0,
    marginTop: "32px",
    zIndex: 1,

    "&::before": {
      backgroundColor: theme.colours.white,
      borderTop: `1px solid ${theme.colours.storm}`,
      content: "''",
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      //100vw takes body width + scrollbar gutter. If we just use 100vw we will see horizontal scrollbar on some devices.
      //In order to avoid that issue we can use 100vw only if there is no scrollbar-gutter and use calc(100vw - 6px) otherwise
      //scrollbar width - 6px(set in component repo)
      width: hasScrollGutter ? "calc(100vw - 6px)" : "100vw",
      height: "100%"
    }
  })
);

export const ContentWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 1,
  position: "relative",

  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    alignItems: "unset",
    width: "calc(100vw - 32px)",
    left: "50%",
    transform: "translateX(-50%)"
  }
}));

export const ButtonsWrapper = styled("div")<{ format: string }>(
  ({ theme, format }) => ({
    display: "flex",
    ...(format === "technicalTable" && {
      flexBasis: "28%"
    }),

    [`.${buttonClasses.root}`]: {
      height: "max-content",

      [theme.breakpoints.down("lg")]: {
        width: "calc(100% - 6px)"
      }
    },

    [theme.breakpoints.down("lg")]: {
      width: "100%",
      justifyContent: "space-between",
      paddingBottom: "10px"
    }
  })
);

export const ButtonsSelectAllPanel = styled("div")(({ theme }) => ({
  display: "flex",
  flexBasis: "80%"
}));

export const FooterBottomWrapper = styled("div")<{ format: string }>(
  ({ theme, format }) => ({
    display: "flex",
    ...(format !== "technicalTable" && {
      borderTop: `1px solid ${theme.colours.storm}`,
      paddingTop: "10px"
    }),
    justifyContent: "space-between"
  })
);

export const SelectAllCheckboxWrapper = styled("div")<{
  format: string;
  isMobile: boolean;
}>(({ format, theme, isMobile }) => ({
  display: "flex",
  alignItems: "center",
  ...(format === "technicalTable" &&
    !isMobile && {
      borderLeft: `1px solid ${theme.colours.storm}`,
      paddingLeft: "5px"
    })
}));

export const SelectAllCheckboxLabel = styled(Button)(() => ({
  marginRight: "5px"
}));

export const TotalSize = styled("div")(({ theme }) => ({
  fontWeight: 400,
  fontFamily: "Effra Medium",
  display: "flex",
  alignItems: "center",
  color: theme.colours.charcoal,
  fontSize: "18px",
  lineHeight: "22px",

  [`.${classes.totalSizeValue}`]: {
    marginLeft: "6px",

    [`&.${classes.totalSizeExceeded}`]: {
      color: theme.colours.error
    }
  }
}));

export const FilesSizeInfoSection = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "end"
}));

export const MaxSizeLabel = styled(Typography)(({ theme }) => ({
  color: theme.colours.slate,
  fontSize: "12px",
  lineHeight: "14px",
  marginTop: "6px"
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.colours.error,
  fontSize: "12px",
  lineHeight: "14px",
  marginTop: "6px",
  textAlign: "end",
  display: "flex",
  alignItems: "center"
}));

export const StyledErrorIcon = styled(ErrorIcon)(({ theme }) => ({
  fill: theme.colours.error,
  width: "14px",
  height: "14px",
  marginRight: "5px"
}));
