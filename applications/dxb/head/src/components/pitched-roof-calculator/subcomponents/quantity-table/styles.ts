import { styled } from "@mui/material/styles";
import { tableCellClasses, tableClasses } from "@mui/material";

const PREFIX = "quantityTableStyles";
export const classes = {
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
  [`& .${tableClasses.root}`]: {
    height: "max-content"
  },
  [`& .${classes.header}`]: {
    minWidth: "100px",
    textAlign: "center"
  },
  [`& .${classes.greyBack}`]: {
    backgroundColor: "#f7f7f7"
  },
  [`& .${classes.picture}`]: {
    height: "80px",
    width: "80px",
    mixBlendMode: "multiply"
  },

  [`& .${classes.boldText}`]: {
    marginTop: "3px",
    marginLeft: "5px",
    fontWeight: "bold"
  },

  [`& .${classes.icon}`]: {
    fill: theme.colours.inter,
    cursor: "pointer"
  },
  [`& .${classes.largeDescription}`]: {
    marginLeft: "32px",
    alignSelf: "center",
    wordBreak: "break-all"
  },
  [`&& .${tableCellClasses.body}`]: {
    padding: "16px"
  }
}));

export const StyledQuantityTableLarge = styled("div")(({ theme }) => ({
  display: "contents",
  [`& .${classes.largeHeaderFirstCell}`]: {
    minWidth: "220px"
  },
  [`& .${classes.header}`]: {
    minWidth: "100px",
    textAlign: "center"
  },
  [`& .${classes.greyBack}`]: {
    backgroundColor: "#f7f7f7"
  },
  [`& .${classes.smallCell}`]: { width: "10%" },
  [`& .${classes.cellRow}`]: {
    display: "flex",
    flexDirection: "row"
  },
  [`& .${classes.picture}`]: {
    height: "70px",
    width: "70px",
    mixBlendMode: "multiply"
  },
  [`& .${classes.boldText}`]: {
    marginTop: "3px",
    marginLeft: "5px",
    fontWeight: "bold"
  },

  [`& .${classes.iteratorCellSmall}`]: {
    maxWidth: "170px",
    "& input": {
      padding: "18px 12px",
      textAlign: "center"
    }
  },
  [`& .${classes.icon}`]: {
    fill: theme.colours.inter,
    cursor: "pointer"
  },
  [`& .${classes.largeDescription}`]: {
    marginLeft: "32px",
    alignSelf: "center",
    wordBreak: "break-all"
  },
  [`& .${classes.largeCell}`]: {
    textAlign: "center",
    width: "17.5%",
    verticalAlign: "middle"
  },
  [`& .${classes.iteratorCellLarge}`]: {
    minWidth: "170px",
    "& input": {
      padding: "18px 12px",
      textAlign: "center"
    }
  }
}));

export const StyledQuantityTableMedium = styled("div")(({ theme }) => ({
  display: "contents",
  [`& .${classes.mediumHeaderFirstCell}`]: {
    minWidth: "204px"
  },
  [`& .${classes.mediumHeaderCell}`]: {
    width: "138px",
    textAlign: "center"
  },
  [`& .${classes.greyBack}`]: {
    backgroundColor: "#f7f7f7"
  },
  [`& .${classes.cellRow}`]: {
    display: "flex",
    flexDirection: "row"
  },
  [`& .${classes.picture}`]: {
    height: "80px",
    width: "80px",
    mixBlendMode: "multiply"
  },
  [`& .${classes.boldText}`]: {
    marginTop: "3px",
    marginLeft: "5px",
    fontWeight: "bold"
  },

  [`& .${classes.icon}`]: {
    fill: theme.colours.inter,
    cursor: "pointer"
  },
  [`& .${classes.mediumTableRow}`]: {
    verticalAlign: "top",
    "& td": {
      height: "100%"
    }
  },
  [`& .${classes.iteratorCellMedium}`]: {
    maxWidth: "170px",
    marginTop: "22px",
    "& input": {
      padding: "18px 12px",
      textAlign: "center"
    }
  },
  [`&& .${classes.mediumCell}`]: {
    marginLeft: "10px",
    textAlign: "left",
    verticalAlign: "middle",
    "&:not(:first-of-type)": {
      verticalAlign: "unset",
      padding: "45px 16px 32px"
    }
  },
  [`& .${classes.mediumCellBasketIconWrapper}`]: {
    height: "100%",
    width: "max-content",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  [`& .${classes.cellMediumRow}`]: {
    display: "flex",
    flexDirection: "row",
    minWidth: "30%"
  },
  [`& .${classes.largeDescription}`]: {
    marginLeft: "32px",
    alignSelf: "center",
    wordBreak: "break-all"
  }
}));

export const StyledQuantityTableSmall = styled("div")(({ theme }) => ({
  [`& .${classes.smallCell}`]: { width: "10%" },
  [`& .${classes.cellRow}`]: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px"
  },
  [`& .${classes.picture}`]: {
    height: "80px",
    width: "80px",
    mixBlendMode: "multiply"
  },
  [`& .${classes.smallDescription}`]: {
    wordBreak: "break-all",
    margin: "32px"
  },
  [`& .${classes.boldText}`]: {
    marginTop: "3px",
    marginLeft: "5px",
    fontWeight: "bold"
  },
  [`& .${classes.cellRowLast}`]: {
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    marginBottom: 0
  },
  [`& .${classes.iteratorCellSmall}`]: {
    maxWidth: "170px",
    "& input": {
      padding: "18px 12px",
      textAlign: "center"
    }
  },
  [`& .${classes.icon}`]: {
    fill: theme.colours.inter,
    cursor: "pointer"
  }
}));
