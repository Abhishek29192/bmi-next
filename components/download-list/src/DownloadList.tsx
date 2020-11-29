import React, { createContext, useContext, useState } from "react";
import Button, { ButtonProps } from "@bmi/button";
import AnchorLink, { Props as AnchorLinkProps } from "@bmi/anchor-link";
import Checkbox, { Props as CheckboxProps } from "@bmi/checkbox";

type Context = {
  list: Record<string, any>;
  updateList: (name: string, value: any) => void;
  resetList: () => void;
  count: number;
};

export const DownloadListContext = createContext<Context>({
  list: {},
  updateList: () => {},
  resetList: () => {},
  count: 0
});

type DownloadListCheckboxProps = Omit<
  CheckboxProps,
  "name" | "value" | "defaultValue" | "checked" | "onChange"
> & {
  name: string;
  value?: any;
  ariaLabel: string;
};

const DownloadListCheckbox = ({
  name,
  value,
  ariaLabel,
  ...rest
}: DownloadListCheckboxProps) => {
  const { list, updateList } = useContext(DownloadListContext);

  return (
    <Checkbox
      name={name}
      inputProps={{
        "aria-label": ariaLabel
      }}
      onChange={(checked: boolean) => {
        updateList(name, checked && value);
      }}
      checked={!!list[name]}
      {...rest}
    />
  );
};

type DownloadListButtonProps = ButtonProps & {
  /** Accepts a {{count}} placeholder that will be replaced by the actual count.  */
  label: string;
  onClick: (list: Context["list"]) => void;
};

const DownloadListButton = ({
  label,
  onClick,
  ...rest
}: DownloadListButtonProps) => {
  const { list, count } = useContext(DownloadListContext);

  return (
    <Button onClick={() => onClick(list)} {...rest}>
      {label.replace("{{count}}", `${count}`)}
    </Button>
  );
};

type DownloadListClearProps = Omit<AnchorLinkProps, "children"> & {
  label: React.ReactNode;
};

const DownloadListClear = ({ label, ...rest }: DownloadListClearProps) => {
  const { resetList } = useContext(DownloadListContext);

  return (
    <AnchorLink onClick={() => resetList()} {...rest}>
      {label}
    </AnchorLink>
  );
};

type Props = {
  children: React.ReactNode;
  onChange?: (list: Context["list"]) => void;
};

const DownloadList = ({ children, onChange }: Props) => {
  const [list, setList] = useState<Context["list"]>({});
  const count = Object.values(list).filter(Boolean).length;

  const handleUpdateList: Context["updateList"] = (name, value) => {
    setList((prevList) => ({
      ...prevList,
      [name]: value
    }));

    if (onChange) {
      onChange(list);
    }
  };

  const handleResetList = () => {
    setList({});
  };

  return (
    <DownloadListContext.Provider
      value={{
        list,
        updateList: handleUpdateList,
        resetList: handleResetList,
        count
      }}
    >
      {children}
    </DownloadListContext.Provider>
  );
};

DownloadList.Checkbox = DownloadListCheckbox;
DownloadList.Button = DownloadListButton;
DownloadList.Clear = DownloadListClear;

export default DownloadList;
