import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
import { Button as DefaultButton, ButtonProps } from "@bmi-digital/components";
import { AnchorLink, AnchorLinkProps } from "@bmi-digital/components";
import Checkbox, {
  Props as CheckboxProps
} from "@bmi-digital/components/checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

type Context = {
  list: Record<string, any>;
  updateList: (name: string, value: any, fileSize?: number) => void;
  resetList: () => void;
  count: number;
  remainingSize: number;
  isLoading: boolean;
  setIsLoading: (newIsLoading: boolean) => void;
};

export const DownloadListContext = createContext<Context>({
  list: {},
  updateList: () => {
    // no-op
  },
  resetList: () => {
    // no-op
  },
  count: 0,
  remainingSize: Infinity,
  isLoading: false,
  setIsLoading: () => {
    // no-op
  }
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
  const { list, updateList, remainingSize, isLoading } =
    useContext(DownloadListContext);
  const maxLimitIsReached: boolean = fileSize
    ? fileSize > remainingSize
    : false;

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
          // eslint-disable-next-line security/detect-object-injection
          disabled={isLoading || list[name] ? isLoading : maxLimitIsReached}
          // eslint-disable-next-line security/detect-object-injection
          checked={!!list[name]}
          {...rest}
        />
      </span>
    </Tooltip>
  );
};

type DownloadListButtonProps = Omit<ButtonProps, "onClick"> & {
  component?: React.ComponentType<any>; // TODO
  /** Accepts a {{count}} placeholder that will be replaced by the actual count.  */
  label: string;
  onClick: (list: Context["list"]) => void | Promise<void>;
};

const DownloadListButton = ({
  component,
  label,
  onClick,
  ...rest
}: DownloadListButtonProps) => {
  const { list, count, resetList, isLoading, setIsLoading } =
    useContext(DownloadListContext);

  const Button = component || DefaultButton;

  const handleClick = async () => {
    setIsLoading(true);
    await onClick(list);
    setIsLoading(false);
    resetList();
  };

  return (
    <>
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
    </>
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
  initialList?: Context["list"];
};

const DownloadList = ({
  children,
  onChange,
  maxSize,
  initialList = {}
}: Props) => {
  const [list, setList] = useState<Context["list"]>(initialList);
  const previousList = usePrevious<Context["list"]>(list);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [size, setSize] = useState<number>(0);
  const count = Object.values(list).filter(Boolean).length;
  const handleUpdateList: Context["updateList"] = (
    name,
    value,
    fileSize = 0
  ) => {
    setList((prevList) => ({
      ...prevList,
      [name]: value
    }));

    setSize((prevSize) => (value ? prevSize + fileSize : prevSize - fileSize));
  };

  const handleResetList = () => {
    setList({});
    setSize(0);
  };

  useEffect(() => {
    if (
      previousList &&
      onChange &&
      JSON.stringify(previousList) !== JSON.stringify(list)
    ) {
      onChange(list);
    }
  }, [previousList, list]);

  return (
    <DownloadListContext.Provider
      value={{
        list,
        updateList: handleUpdateList,
        resetList: handleResetList,
        count,
        remainingSize: maxSize ? maxSize - size : Infinity,
        isLoading,
        setIsLoading
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
