import React from "react";
import classnames from "classnames";
import MaterialChip from "@material-ui/core/Chip";
import ClearIcon from "@material-ui/icons/Clear";
import { Colors } from "@bmi-digital/components";
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
        deleteIcon={<ClearIcon />}
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
