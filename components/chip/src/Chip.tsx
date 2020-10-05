import React from "react";
import classnames from "classnames";
import MaterialChip from "@material-ui/core/Chip";
import ClearIcon from "@material-ui/icons/Clear";
import { Colors } from "@bmi/color-pair";
import styles from "./Chip.module.scss";

type Props = {
  children: React.ReactNode;
  theme?: Colors;
  onClick?: () => void | undefined;
} & (
  | {
      type?: "selectable";
      isSelected?: boolean;
    }
  | {
      type: "removable";
      isSelected?: boolean;
    }
);

const Chip = ({
  children,
  theme = "pearl",
  onClick = undefined,
  ...rest
}: Props) => {
  if (rest.type == "removable") {
    return (
      <MaterialChip
        className={classnames(
          styles["Chip"],
          styles["Chip--removable"],
          styles["Chip--default"],
          {
            [styles[`Chip--theme-${theme}`]]: !!theme
          }
        )}
        label={children}
        onClick={onClick}
        onDelete={onClick}
        deleteIcon={<ClearIcon />}
        {...rest}
      />
    );
  }

  return (
    <MaterialChip
      className={classnames(styles["Chip"], {
        [styles["Chip--default"]]: !(
          rest.type == "selectable" && rest.isSelected
        ),
        [styles[`Chip--theme-${theme}`]]: !!theme
      })}
      label={children}
      onClick={onClick}
      color={
        rest.type == "selectable" && rest.isSelected ? "primary" : "default"
      }
      {...rest}
    />
  );
};

export default Chip;
