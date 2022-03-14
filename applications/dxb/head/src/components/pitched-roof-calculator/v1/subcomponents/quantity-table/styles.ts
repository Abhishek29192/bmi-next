import { ThemeOptions } from "@bmi/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    displayIfSmall: {
      display: "block",
      [theme.breakpoints!.up!("sm")]: {
        display: "none"
      }
    },

    displayIfMedium: {
      display: "none",
      [theme.breakpoints!.up!("sm")]: {
        display: "block"
      }
    },

    smallCell: {
      width: "10%"
    },

    mediumCell: {
      textAlign: "center",
      width: "17.5%"
    },

    header: {
      minWidth: "100px",
      textAlign: "center"
    },

    firstHeader: {
      minWidth: "100px"
    },

    greyBack: {
      backgroundColor: "#f7f7f7"
    },

    smallDescription: {
      margin: "10px"
    },

    packSizes: {
      width: "100px"
    },

    cellMediumRow: {
      display: "flex",
      flexDirection: "row",
      marginBottom: "10px",
      minWidth: "30%"
    },

    cellRow: {
      display: "flex",
      flexDirection: "row",
      marginBottom: "10px"
    },

    firstDescription: {
      marginLeft: "10px",
      alignSelf: "center"
    },

    cellRowLast: {
      justifyContent: "space-between",
      alignItems: "center"
    },

    icon: {
      fill: theme.colours.inter,
      cursor: "pointer"
    },

    picture: {
      height: "80px",
      width: "80px",
      mixBlendMode: "multiply"
    },

    boldText: {
      marginTop: "3px",
      marginLeft: "5px",
      fontWeight: "bold"
    },

    iteratorCellSmall: {
      maxWidth: "170px"
    },

    iteratorCellMedium: {
      minWidth: "170px"
    }
  }),
  { name: "QuantityTable" }
);
