import React from "react";
import classnames from "classnames";
import ToggleCard, { ToggleCardProps } from "@bmi/toggle-card";
import styles from "./CardRadioButton.module.scss";

export type Props = {
  name?: string;
  value: string;
  checked?: boolean;
  className?: string;
  onChange?: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
} & ToggleCardProps;

const CardRadioButton = ({
  name,
  value,
  checked,
  className,
  onChange,
  ...rest
}: Props) => {
  return (
    <div className={classnames(styles["CardRadioButton"], className)}>
      <label>
        <input
          className={styles["input"]}
          type="radio"
          {...{ name, value, checked, onChange }}
        />
        <ToggleCard className={styles["card"]} {...rest} />
      </label>
    </div>
  );
};

CardRadioButton.Paragraph = ToggleCard.Paragraph;

export default CardRadioButton;
