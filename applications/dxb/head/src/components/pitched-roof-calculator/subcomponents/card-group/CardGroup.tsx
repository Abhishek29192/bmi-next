import {
  CardCheckboxGroup as CheckBoxGroup,
  CardCheckboxGroupProps,
  CardRadioGroup as RadioGroup,
  CardRadioGroupProps,
  WithFormControlProps
} from "@bmi-digital/components";
import React from "react";
import classnames from "classnames";
import {
  classes,
  StyledCardCheckboxGroup,
  StyledCardRadioGroup
} from "./CardGroup.styles";

type RadioGroupProps = CardRadioGroupProps & WithFormControlProps<string>;
type CheckboxGroupProps = CardCheckboxGroupProps &
  WithFormControlProps<string[]>;

const CardRadioGroup = (props: RadioGroupProps) => {
  return (
    <StyledCardRadioGroup
      {...props}
      gridContainerClassName={classes.gridContainer}
    />
  );
};

CardRadioGroup.Item = RadioGroup.Item;

const CardCheckboxGroup = ({
  className,
  gridContainerClassName,
  ...rest
}: CheckboxGroupProps) => {
  return (
    <StyledCardCheckboxGroup
      {...rest}
      className={className}
      gridContainerClassName={classnames(
        classes.gridContainer,
        gridContainerClassName
      )}
    />
  );
};

CardCheckboxGroup.Item = CheckBoxGroup.Item;

export { CardCheckboxGroup, CardRadioGroup };
