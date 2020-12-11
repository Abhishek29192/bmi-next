import React, { createContext, useContext, useState } from "react";
import Button, { ButtonProps } from "@bmi/button";
import AnchorLink, { Props as AnchorLinkProps } from "@bmi/anchor-link";
import Checkbox, { Props as CheckboxProps } from "@bmi/checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

type Context = {
  list: Record<string, any>;
  updateList: (name: string, value: any, fileSize?: number) => void;
  resetList: () => void;
  count: number;
  remainingSize: number;
};

export const DownloadListContext = createContext<Context>({
  list: {},
  updateList: () => {},
  resetList: () => {},
  count: 0,
  remainingSize: Infinity
});

type DownloadListCheckboxProps = Omit<
  CheckboxProps,
  "name" | "value" | "defaultValue" | "checked" | "onChange"
> & {
  name: string;
  value?: any;
  fileSize?: number;
  ariaLabel: string;
  maxLimitReachedLabel?: string;
};

const DownloadListCheckbox = ({
  name,
  value,
  fileSize,
  ariaLabel,
  maxLimitReachedLabel = "Max download limit reached",
  ...rest
}: DownloadListCheckboxProps) => {
  const { list, updateList, remainingSize } = useContext(DownloadListContext);
  const maxLimitIsReached: boolean = fileSize > remainingSize;

  return (
    <Tooltip
      title={maxLimitReachedLabel}
      disableHoverListener={!maxLimitIsReached}
    >
      <span>
        <Checkbox
          name={name}
          inputProps={{
            "aria-label": ariaLabel
          }}
          onChange={(checked: boolean) => {
            updateList(name, checked && value, fileSize);
          }}
          disabled={list[name] ? false : maxLimitIsReached}
          checked={!!list[name]}
          {...rest}
        />
      </span>
    </Tooltip>
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
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onClick(list);
    setIsLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={isLoading} {...rest}>
      {label.replace("{{count}}", `${count}`)}
      {isLoading && (
        <CircularProgress
          size={24}
          color="inherit"
          style={{ marginLeft: "0.5rem" }}
        />
      )}
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
  maxSize?: number;
  onChange?: (list: Context["list"]) => void;
};

const DownloadList = ({ children, onChange, maxSize }: Props) => {
  const [list, setList] = useState<Context["list"]>({});
  const [size, setSize] = useState<number>(0);
  const count = Object.values(list).filter(Boolean).length;
  const handleUpdateList: Context["updateList"] = (name, value, fileSize) => {
    setList((prevList) => ({
      ...prevList,
      [name]: value
    }));

    setSize((prevSize) => (value ? prevSize + fileSize : prevSize - fileSize));

    if (onChange) {
      onChange(list);
    }
  };

  const handleResetList = () => {
    setList({});
    setSize(0);
  };

  return (
    <DownloadListContext.Provider
      value={{
        list,
        updateList: handleUpdateList,
        resetList: handleResetList,
        count,
        remainingSize: maxSize - size
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
