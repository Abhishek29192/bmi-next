import React, { useState } from "react";
import classnames from "classnames";
import Button from "@bmi/button";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Icon from "@bmi/icon";
import { withFormControl } from "@bmi/form";
import RawTextField from "@bmi/raw-text-field";
import styles from "./UpDownSimpleNumericInput.module.scss";

type Props = {
  name: string;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  defaultValue?: number;
  buttonPlacement?: "sides" | "right";
  lockBreakpoint?: "xs" | "sm" | "md" | "lg" | false;
};

const getValidValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(min, value), max);
};

const UpDownSimpleNumericInput = ({
  name,
  onChange,
  step = 1,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  buttonPlacement = "sides",
  lockBreakpoint = "xs"
}: Props) => {
  const [count, setCount] = useState(() =>
    getValidValue(defaultValue, min, max)
  );

  const handleChange = (value: number) => {
    const newValue = getValidValue(value, min, max);
    setCount(newValue);
    onChange(newValue);
  };

  const handleIncrement = () => handleChange(count + step);
  const handleDecrement = () => handleChange(count - step);

  const handleInputChange = (value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) handleChange(newValue);
  };

  const UpButton = (
    <Button
      isIconButton
      className={styles["button"]}
      onClick={handleIncrement}
      accessibilityLabel={"Up"}
    >
      <Icon source={AddIcon} />
    </Button>
  );

  const DownButton = (
    <Button
      isIconButton
      className={styles[`button-${buttonPlacement}`]}
      onClick={handleDecrement}
      accessibilityLabel={"Down"}
    >
      <Icon source={RemoveIcon} />
    </Button>
  );

  const InputComponent = (
    <RawTextField
      name={name}
      variant="hybrid"
      className={classnames(
        styles["input"],
        buttonPlacement === "sides" && styles["input-in-middle"]
      )}
      value={count.toString()}
      onChange={handleInputChange}
    />
  );

  const ComponentWithButtonsOnEitherSide = (
    <div
      className={classnames(
        styles["UpDownSimpleNumericInput"],
        lockBreakpoint &&
          styles[`UpDownSimpleNumericInput--locked-${lockBreakpoint}`]
      )}
    >
      {DownButton}
      {InputComponent}
      {UpButton}
    </div>
  );

  const ComponentWithButtonsOnTheRight = (
    <div
      className={classnames(
        styles["UpDownSimpleNumericInput"],
        lockBreakpoint &&
          styles[`UpDownSimpleNumericInput--locked-${lockBreakpoint}`]
      )}
    >
      {InputComponent}
      {DownButton}
      {UpButton}
    </div>
  );

  const CounterComponent =
    buttonPlacement == "right"
      ? ComponentWithButtonsOnTheRight
      : ComponentWithButtonsOnEitherSide;
  return CounterComponent;
};

export default withFormControl<Props, number>(UpDownSimpleNumericInput);
