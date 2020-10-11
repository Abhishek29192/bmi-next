import React, { useState } from "react";
import RadioButton, { Props as RadioButtonProps } from "@bmi/radio-button";
import { withFormControl } from "@bmi/form";
import classnames from "classnames";
import styles from "./RadioGroup.module.scss";

type Props = {
  name: string;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const isRadioItemElement = (
  element: React.ReactNode
): element is React.ReactElement<RadioButtonProps, typeof RadioButton> =>
  typeof element === "object" &&
  "type" in element &&
  element.type === RadioButton;

const RadioGroup = ({
  name,
  className,
  children,
  defaultValue,
  onChange
}: Props) => {
  const [selected, setSelected] = useState(defaultValue);
  const items = React.Children.map(children, (child) => {
    if (isRadioItemElement(child)) {
      const { value, className } = child.props;

      const handleOnChange = () => {
        setSelected(value);

        if (onChange) {
          onChange(value);
        }
      };

      return React.cloneElement(child, {
        name,
        checked: value === selected,
        onChange: handleOnChange,
        className: classnames(styles["item"], className)
      });
    } else {
      return child;
    }
  });

  return (
    <div className={classnames(styles["RadioGroup"], className)}>
      <div className={styles["container"]}>{items}</div>
    </div>
  );
};

const RadioGroupFormControl = Object.defineProperty(
  withFormControl<Props>(RadioGroup),
  "Item",
  {
    value: RadioButton,
    writable: false
  }
);

export default RadioGroupFormControl;
