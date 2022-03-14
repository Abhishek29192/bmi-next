import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      borderBottom: `1px solid ${theme.colours.storm}`,
      paddingTop: "40px",
      paddingBottom: "60px"
    },
    title: {
      // TODO: This MUI spacing * 2. Can we expose this as variable?
      marginBottom: "16px"
    },
    shownLinksContainer: {
      "& $link:last-child": {
        marginBottom: 0
      }
    },
    linkWrapper: {
      display: "flex",
      marginBottom: "8px"
    },
    icon: {
      color: theme.colours.inter,
      width: "24px",
      height: "24px",
      marginRight: "8px"
    },
    link: {
      display: "block",
      fontSize: "18px",
      marginBottom: "16px"
    },
    hiddenLinksContainer: {
      "& $link:first-child": {
        marginTop: "16px"
      },
      "& $link:last-child": {
        marginBottom: 0
      }
    }
  }),
  { name: "ExpandableLinksTextCard" }
);
