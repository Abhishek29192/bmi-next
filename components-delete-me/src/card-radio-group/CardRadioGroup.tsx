import React, { useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import CardInput, { Props as CardInputProps } from "../card-input/CardInput";
import withFormControl from "../form/withFormControl";
import Grid from "../grid/Grid";
import styles from "./CardRadioGroup.module.scss";

export type Props = {
  name: string;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string;
  onChange?: (value: string) => void;
  clean?: boolean;
};

const isRadioItemElement = (
  element: React.ReactNode
): element is React.ReactElement<CardInputProps, typeof CardInput> =>
  React.isValidElement(element) && element.type === CardInput;

const CardRadioGroup = ({
  name,
  className,
  defaultValue,
  onChange,
  children,
  clean
}: Props) => {
  const [selected, setSelected] = useState(defaultValue);
  const items = useMemo(
    () =>
      React.Children.map(children, (child) => {
        let result = child;

        if (isRadioItemElement(child)) {
          const { value, className } = child.props;

          const handleOnChange = () => {
            setSelected(value);

            onChange && onChange(value);
          };

          result = React.cloneElement(child, {
            name,
            checked: value === selected,
            onChange: handleOnChange,
            className: classnames(styles["item"], className)
          });
        }

        return (
          <Grid item xs={6} md={4} lg={2}>
            {result}
          </Grid>
        );
      }),
    [children, name, selected, onChange]
  );

  useEffect(() => {
    setSelected(defaultValue);
  }, [clean]);

  return (
    <div className={classnames(styles["CardRadioGroup"], className)}>
      <Grid container spacing={2}>
        {items}
      </Grid>
    </div>
  );
};

const controlledRadioGroupFormControl = withFormControl<Props, string>(
  CardRadioGroup
);
const CardRadioGroupFormControl = Object.defineProperty(
  controlledRadioGroupFormControl,
  "Item",
  {
    value: CardInput,
    writable: false
  }
) as typeof controlledRadioGroupFormControl & {
  Item: typeof CardInput;
};

export default CardRadioGroupFormControl;
