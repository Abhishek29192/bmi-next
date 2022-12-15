import { styled } from "@mui/material/styles";

const PREFIX = "quantityTableStyles";
export const classes = {
  displayIfSmall: `${PREFIX}-displayIfSmall`,
  displayIfMedium: `${PREFIX}-displayIfMedium`,
  displayIfLarge: `${PREFIX}-displayIfLarge`,
  smallCell: `${PREFIX}-smallCell`,
  largeCell: `${PREFIX}-largeCell`,
  header: `${PREFIX}-header`,
  mediumHeaderCell: `${PREFIX}-mediumHeaderCell`,
  largeHeaderFirstCell: `${PREFIX}-largeHeaderFirstCell`,
  mediumHeaderFirstCell: `${PREFIX}-mediumHeaderFirstCell`,
  mediumCell: `${PREFIX}-mediumCell`,
  mediumTableRow: `${PREFIX}-mediumTableRow`,
  largeDescription: `${PREFIX}-largeDescription`,
  greyBack: `${PREFIX}-greyBack`,
  smallDescription: `${PREFIX}-smallDescription`,
  packSizes: `${PREFIX}-packSizes`,
  cellMediumRow: `${PREFIX}-cellMediumRow`,
  cellRow: `${PREFIX}-cellRow`,
  cellRowLast: `${PREFIX}-cellRowLast`,
  icon: `${PREFIX}-icon`,
  picture: `${PREFIX}-picture`,
  boldText: `${PREFIX}-boldText`,
  iteratorCellSmall: `${PREFIX}-iteratorCellSmall`,
  iteratorCellMedium: `${PREFIX}-iteratorCellMedium`,
  iteratorCellLarge: `${PREFIX}-iteratorCellLarge`,
  mediumCellBasketIconWrapper: `${PREFIX}-mediumCellBasketIconWrapper`
};

export const StyledQuantityTable = styled("div")(({ theme }) => ({
  [`&.${classes.displayIfSmall}`]: {
    display: "table",
    [theme.breakpoints!.up!("sm")]: {
      display: "none"
    }
  },
  [`&.${classes.displayIfMedium}`]: {
    display: "none",
    height: "100%",
    [theme.breakpoints!.up!("sm")]: {
      display: "table"
    },
    [theme.breakpoints!.up!("lg")]: {
      display: "none"
    }
  },
  [`&.${classes.displayIfLarge}`]: {
    display: "none",
    [theme.breakpoints!.up!("lg")]: {
      display: "table"
    }
  },
  [`&.${classes.mediumHeaderFirstCell}`]: {
    minWidth: "204px"
  },
  [`&.${classes.mediumHeaderCell}`]: {
    width: "138px",
    textAlign: "center"
  },
  [`&.${classes.largeHeaderFirstCell}`]: {
    minWidth: "220px"
  },
  [`&.${classes.header}`]: {
    minWidth: "100px",
    textAlign: "center"
  },
  [`&.${classes.greyBack}`]: {
    backgroundColor: "#f7f7f7"
  },
  [`&.${classes.smallCell}`]: { width: "10%" },
  [`&.${classes.cellRow}`]: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px"
  },
  [`&.${classes.picture}`]: {
    height: "80px",
    width: "80px",
    mixBlendMode: "multiply"
  },
  [`&.${classes.smallDescription}`]: {
    wordBreak: "break-all",
    margin: "10px"
  },
  [`&.${classes.cellRow}`]: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px"
  },
  [`&.${classes.boldText}`]: {
    marginTop: "3px",
    marginLeft: "5px",
    fontWeight: "bold"
  },
  [`&.${classes.cellRowLast}`]: {
    justifyContent: "space-between",
    alignItems: "center"
  },
  [`&.${classes.iteratorCellSmall}`]: {
    maxWidth: "170px",
    "& input": {
      padding: "18px 12px",
      textAlign: "center"
    }
  },
  [`&.${classes.icon}`]: {
    fill: theme.colours.inter,
    cursor: "pointer"
  },
  [`&.${classes.mediumTableRow}`]: {
    verticalAlign: "top",
    "& td": {
      height: "100%"
    },
    "& > td:not(:first-child)": {
      padding: "45px 0 32px"
    }
  },
  [`&.${classes.largeDescription}`]: {
    marginLeft: "10px",
    alignSelf: "center",
    wordBreak: "break-all"
  },
  [`&.${classes.iteratorCellMedium}`]: {
    maxWidth: "170px",
    marginTop: "22px",
    "& input": {
      padding: "18px 12px",
      textAlign: "center"
    }
  },
  [`&.${classes.mediumCell}`]: {
    marginLeft: "10px",
    textAlign: "center"
  },
  [`&.${classes.mediumCellBasketIconWrapper}`]: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  [`&.${classes.largeCell}`]: {
    textAlign: "center",
    width: "17.5%"
  },
  [`&.${classes.iteratorCellLarge}`]: {
    minWidth: "170px",
    "& input": {
      padding: "18px 12px",
      textAlign: "center"
    }
  },
  [`&.${classes.cellMediumRow}`]: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px",
    minWidth: "30%"
  }
}));
