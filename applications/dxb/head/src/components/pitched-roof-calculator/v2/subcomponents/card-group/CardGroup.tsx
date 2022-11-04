import {
  CardCheckboxGroup as CheckBoxGroup,
  CardCheckboxGroupProps,
  CardRadioGroup as RadioGroup,
  CardRadioGroupProps,
  WithFormControlProps
} from "@bmi/components";
import React from "react";
import classnames from "classnames";
import styles from "./CardGroup.module.scss";

type RadioGroupProps = CardRadioGroupProps & WithFormControlProps<string>;
type CheckboxGroupProps = CardCheckboxGroupProps &
  WithFormControlProps<string[]>;

const CardRadioGroup = (props: RadioGroupProps) => {
  return (
    <RadioGroup
      {...props}
      className={styles["CardGroup"]}
      gridContainerClassName={styles["gridContainer"]}
    />
  );
};

CardRadioGroup.Item = RadioGroup.Item;

const CardCheckboxGroup = ({ className, ...rest }: CheckboxGroupProps) => {
  return (
    <CheckBoxGroup
      {...rest}
      className={classnames(styles["CardGroup"], className)}
      gridContainerClassName={styles["gridContainer"]}
    />
  );
};

CardCheckboxGroup.Item = CheckBoxGroup.Item;

export { CardCheckboxGroup, CardRadioGroup };
