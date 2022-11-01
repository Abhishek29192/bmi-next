import classnames from "classnames";
import React from "react";
import ToggleCard, { ToggleCardProps } from "../toggle-card";
import { useStyles } from "./styles";

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
  const classes = useStyles();

  return (
    <div className={classnames(classes.root, className)}>
      <label>
        <input
          className={classes.input}
          {...{ type, name, value, checked, onChange }}
        />
        <ToggleCard className={classes.card} {...rest} />
      </label>
    </div>
  );
};

CardInput.Paragraph = ToggleCard.Paragraph;

export default CardInput;
