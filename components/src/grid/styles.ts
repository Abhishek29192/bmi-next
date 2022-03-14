import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    item: {},
    justifyContent: {
      "& .item:nth-child(4):nth-last-child(2)": {
        [theme.breakpoints!.up!("xl")]: {
          marginLeft: "20px"
        }
      }
    }
  }),
  { name: "Grid" }
);
