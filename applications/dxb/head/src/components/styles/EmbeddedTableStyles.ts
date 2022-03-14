import { ThemeOptions } from "@bmi/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      margin: "24px 0",

      "&:last-child": {
        marginBottom: 0
      },

      "&:hover": {
        color: theme.colours.focus,
        transition: "text-decoration-color 250ms ease-out, color 250ms ease-out"
      },

      "& a": {
        color: theme.colours.inter,
        textDecoration: "underline",
        textDecorationColor: "currentColor",
        fontSize: "inherit",
        cursor: "pointer"
      }
    }
  }),
  { name: "EmbeddedTable" }
);
