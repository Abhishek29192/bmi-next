import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    button: {
      marginTop: "10px"
    },
    wrapper: {
      display: "flex",
      flexWrap: "wrap"
    },
    tile: {
      width: "300px",
      padding: "10px",
      margin: "10px",
      height: "160px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly"
    },
    clickable: {
      "&:hover": {
        cursor: "pointer"
      }
    },
    description: {
      textAlign: "center"
    },
    icon: {
      height: "59px",
      width: "59px"
    }
  }),
  { name: "TileList" }
);
