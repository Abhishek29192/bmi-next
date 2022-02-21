import React, { useState } from "react";
import classnames from "classnames";
import RadioButton, {
  Props as RadioButtonProps
} from "../radio-button/RadioButton";
import withFormControl from "../form/withFormControl";
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
  (element &&
    typeof element === "object" &&
    "type" in element &&
    element.type === RadioButton) ||
  false;

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
        onChange && onChange(value);
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

const controlledRadioGroup = withFormControl<Props, string>(RadioGroup);
const RadioGroupFormControl = Object.defineProperty(
  controlledRadioGroup,
  "Item",
  {
    value: RadioButton,
    writable: false
  }
) as typeof controlledRadioGroup & { Item: typeof RadioButton };

export default RadioGroupFormControl;
