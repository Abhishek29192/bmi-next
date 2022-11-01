import { ThemeOptions } from "@bmi-digital/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    displayIfSmall: {
      display: "table",
      [theme.breakpoints!.up!("sm")]: {
        display: "none"
      }
    },
    displayIfMedium: {
      display: "none",
      height: "100%",
      [theme.breakpoints!.up!("sm")]: {
        display: "table"
      },
      [theme.breakpoints!.up!("lg")]: {
        display: "none"
      }
    },
    displayIfLarge: {
      display: "none",
      [theme.breakpoints!.up!("lg")]: {
        display: "table"
      }
    },
    smallCell: {
      width: "10%"
    },
    largeCell: {
      textAlign: "center",
      width: "17.5%"
    },
    header: {
      minWidth: "100px",
      textAlign: "center"
    },
    largeHeaderFirstCell: {
      minWidth: "220px"
    },
    mediumHeaderFirstCell: {
      minWidth: "204px"
    },
    mediumHeaderCell: {
      width: "138px",
      textAlign: "center"
    },
    mediumCell: {
      marginLeft: "10px",
      textAlign: "center"
    },
    greyBack: {
      backgroundColor: "#f7f7f7"
    },
    smallDescription: {
      wordBreak: "break-all",
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
    mediumTableRow: {
      verticalAlign: "top",
      "& td": {
        height: "100%"
      },
      "& > td:not(:first-child)": {
        padding: "45px 0 32px"
      }
    },
    largeDescription: {
      marginLeft: "10px",
      alignSelf: "center",
      wordBreak: "break-all"
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
      maxWidth: "170px",
      "& input": {
        padding: "18px 12px",
        textAlign: "center"
      }
    },
    iteratorCellMedium: {
      maxWidth: "170px",
      marginTop: "22px",
      "& input": {
        padding: "18px 12px",
        textAlign: "center"
      }
    },
    iteratorCellLarge: {
      minWidth: "170px",
      "& input": {
        padding: "18px 12px",
        textAlign: "center"
      }
    },
    mediumCellBasketIconWrapper: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }),
  { name: "QuantityTable" }
);
