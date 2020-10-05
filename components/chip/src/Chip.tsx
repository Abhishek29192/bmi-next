import React from "react";
import classnames from "classnames";
import MaterialChip from "@material-ui/core/Chip";
import { Colors } from "@bmi/color-pair";
import styles from "./Chip.module.scss";

type Props = {
  children: React.ReactNode;
  theme?: Colors;
  onClick?: () => void;
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

const Chip = ({ children, theme = "pearl", ...rest }: Props) => {
  return (
    <MaterialChip
      className={classnames(styles["Chip"], {
        [styles[`Chip--${rest.type}`]]: !!rest.type,
        [styles["Chip--default"]]: !(
          rest.type == "selectable" && rest.isSelected
        ),
        [styles[`Chip--theme-${theme}`]]: !!theme
      })}
      label={children}
      color={
        rest.type == "selectable" && rest.isSelected ? "primary" : "default"
      }
      {...rest}
    />
  );
};

export default Chip;
