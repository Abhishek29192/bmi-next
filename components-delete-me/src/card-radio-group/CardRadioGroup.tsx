import classnames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import CardInput, { Props as CardInputProps } from "../card-input/CardInput";
import withFormControl from "../form/withFormControl";
import Grid from "../grid/Grid";
import { useStyles } from "./styles";

export type Props = {
  name: string;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string;
  onChange?: (value: string) => void;
  clean?: boolean;
  gridContainerClassName?: string;
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
  clean,
  gridContainerClassName
}: Props) => {
  const [selected, setSelected] = useState(defaultValue);
  const classes = useStyles();
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
            className: classnames(classes.item, className)
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
    <div className={classnames(classes.root, className)}>
      <Grid container spacing={2} className={gridContainerClassName}>
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
