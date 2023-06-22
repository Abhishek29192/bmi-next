import {
  CardCheckboxGroup as CheckBoxGroup,
  CardCheckboxGroupProps,
  CardRadioGroup as RadioGroup,
  CardRadioGroupProps,
  WithFormControlProps
} from "@bmi-digital/components";
import classnames from "classnames";
import React from "react";
import { classes } from "./CardGroup.styles";

type RadioGroupProps = CardRadioGroupProps & WithFormControlProps<string>;
type CheckboxGroupProps = CardCheckboxGroupProps &
  WithFormControlProps<string[]>;

const CardRadioGroup = (props: RadioGroupProps) => {
  return (
    <RadioGroup
      {...props}
      className={classes.root}
      gridContainerClassName={classes.gridContainer}
    />
  );
};

CardRadioGroup.Item = RadioGroup.Item;

const CardCheckboxGroup = ({ className, ...rest }: CheckboxGroupProps) => {
  return (
    <CheckBoxGroup
      {...rest}
      className={classnames(classes.root, className)}
      gridContainerClassName={classes.gridContainer}
    />
  );
};

CardCheckboxGroup.Item = CheckBoxGroup.Item;

export { CardCheckboxGroup, CardRadioGroup };
