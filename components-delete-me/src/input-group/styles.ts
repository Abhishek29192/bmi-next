import { CreateCSSProperties, makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const locked: CreateCSSProperties = {
  flexDirection: "row",
  "& $input": {
    margin: 0,
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: "4px",
    borderBottomLeftRadius: "4px",
    "& .MuiOutlinedInput-notchedOutline, .MuiFilledInput-root": {
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
      borderTopRightRadius: "0px",
      borderBottomRightRadius: "0px",
      borderRight: "none"
    }
  },
  "& $button": {
    borderTopLeftRadius: "0px",
    borderBottomLeftRadius: "0px",
    height: "auto",
    "&[class*=MuiIconButton-root]": {
      width: "56px"
    }
  }
};

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      flexDirection: "column"
    },
    input: {
      marginBottom: "15px"
    },
    lockedxs: { ...locked },
    lockedsm: { [theme.breakpoints!.up!("sm")]: { ...locked } },
    lockedmd: { [theme.breakpoints!.up!("md")]: { ...locked } },
    lockedlg: { [theme.breakpoints!.up!("lg")]: { ...locked } },
    button: {}
  }),
  {
    name: "InputGroup"
  }
);
