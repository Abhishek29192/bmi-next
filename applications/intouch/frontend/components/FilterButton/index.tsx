import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export type FilterButtonProps = {
  label: string;
};

// This uses the makeStyles function from MUI rather than CSS modules because
// the base MUI styles are not overrideable at that level for button components.
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: "44px",
      backgroundColor: "#f7f7f7",
      marginRight: "0.5em",
      marginBottom: "0.5em",
      color: "007bbd",
      "&:hover": {
        backgroundColor: "#f0f0f0"
      },
      "& > .MuiButton-label": {
        color: "#007bbd"
      }
    }
  })
);

export const FilterButton = ({ label }: FilterButtonProps) => {
  const classes = useStyles();

  return (
    <Button className={classes.root} variant="contained" disableElevation>
      {label}
    </Button>
  );
};
