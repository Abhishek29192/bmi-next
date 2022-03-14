import { Chip as MaterialChip } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import { Colors } from "../color-pair";
import { useStyles } from "./styles";

export type Props = {
  children: React.ReactNode;
  theme?: Colors;
  onClick?: () => void;
  className?: string;
} & (
  | {
      type?: "selectable";
      isSelected?: boolean;
    }
  | {
      type: "removable";
    }
);

const Chip = ({
  children,
  theme = "pearl",
  onClick = undefined,
  className,
  ...rest
}: Props) => {
  const classes = useStyles();

  if (rest.type == "removable") {
    const { type, ...chipProps } = rest;

    return (
      <MaterialChip
        className={classnames(
          className,
          classes.root,
          classes.default,
          theme === "white" && classes.themeWhite
        )}
        label={children}
        onClick={onClick}
        onDelete={onClick}
        deleteIcon={<Clear />}
        {...chipProps}
      />
    );
  }

  const { type, isSelected, ...chipProps } = rest;

  return (
    <MaterialChip
      className={classnames(
        classes.root,
        theme === "white" && classes.themeWhite,
        !(type === "selectable" && isSelected) && classes.default
      )}
      label={children}
      onClick={onClick}
      color={isSelected ? "primary" : "default"}
      {...chipProps}
    />
  );
};
export default Chip;
