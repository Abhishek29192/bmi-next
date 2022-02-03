import React from "react";
import classnames from "classnames";
import ToggleCard, { ToggleCardProps } from "@bmi/toggle-card";
import styles from "./CardInput.module.scss";

export type Props = {
  type?: "radio" | "checkbox";
  name?: string;
  value: string;
  checked?: boolean;
  className?: string;
  onChange?: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
} & Omit<ToggleCardProps, "onChange">;

const CardInput = ({
  type = "radio",
  name,
  value,
  checked,
  className,
  onChange,
  ...rest
}: Props) => {
  return (
    <div className={classnames(styles["CardInput"], className)}>
      <label>
        <input
          className={styles["input"]}
          {...{ type, name, value, checked, onChange }}
        />
        <ToggleCard className={styles["card"]} {...rest} />
      </label>
    </div>
  );
};

CardInput.Paragraph = ToggleCard.Paragraph;

export default CardInput;
