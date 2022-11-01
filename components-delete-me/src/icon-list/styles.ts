import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      margin: "20px",
      marginLeft: 0,
      paddingLeft: 0
    },
    listItem: {
      marginBottom: "40px",
      display: "flex"
    },
    isCompact: {
      marginBottom: 0,
      "& $icon": {
        marginTop: "-3px"
      },
      "& $description": {
        marginTop: 0,
        marginBottom: "20px"
      }
    },
    icon: {
      marginTop: "-5px",
      marginRight: "15px",
      "& .MuiSvgIcon-root": {
        fontSize: "28px"
      }
    },
    content: {
      display: "flex",
      flexDirection: "column",
      wordBreak: "break-word"
    },
    description: {
      marginTop: "20px"
    }
  }),
  {
    name: "IconList"
  }
);
