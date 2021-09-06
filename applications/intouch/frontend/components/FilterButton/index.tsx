import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import styles from "./styles.module.scss";

export type FilterButtonProps = {
  label: string;
  isActive?: Boolean;
  onClick?: () => void;
};

interface MakeStylesProps {
  isActive: Boolean;
}

const useStyles = makeStyles<Theme, MakeStylesProps>((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: "44px",
      backgroundColor: ({ isActive }) =>
        isActive ? styles["color-cyan"] : styles["color-pearl"],
      marginRight: "0.5em",
      marginBottom: "0.5em",
      color: "#007bbd",
      padding: "0.2rem",
      "&:hover": {
        backgroundColor: "#f0f0f0"
      },
      "& > .MuiButton-label": {
        color: "#007bbd",
        margin: 0,
        padding: "2px 10px"
      },
      textTransform: "capitalize"
    }
  })
);

export const FilterButton = ({
  label,
  isActive,
  onClick
}: FilterButtonProps) => {
  const { root } = useStyles({ isActive });

  return (
    <Button
      className={root}
      variant="contained"
      disableElevation
      onClick={() => onClick && onClick()}
    >
      {label}
    </Button>
  );
};
