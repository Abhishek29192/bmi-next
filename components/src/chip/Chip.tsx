import React from "react";
import classnames from "classnames";
import { Chip as MaterialChip } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { Colors } from "../color-pair/ColorPair";
import styles from "./Chip.module.scss";

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
  if (rest.type == "removable") {
    const { type, ...chipProps } = rest;

    return (
      <MaterialChip
        className={classnames(
          className,
          styles["Chip"],
          styles["Chip--removable"],
          styles["Chip--default"],
          styles[`Chip--theme-${theme}`] && styles[`Chip--theme-${theme}`]
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
        styles["Chip"],
        {
          [styles["Chip--default"]!]: !(
            rest.type === "selectable" && rest.isSelected
          )
        },
        styles[`Chip--theme-${theme}`] && [styles[`Chip--theme-${theme}`]]
      )}
      label={children}
      onClick={onClick}
      color={isSelected ? "primary" : "default"}
      {...chipProps}
    />
  );
};
export default Chip;
