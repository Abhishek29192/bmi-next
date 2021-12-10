import React, {
  ConsumerProps,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import classnames from "classnames";
import styles from "./EqualHeights.module.scss";

type Context = {
  addRef: (id: string | number) => RefObject<any>;
  equalHeight: number | "auto";
  updateRef: () => void;
};

const EqualHeightsContext = React.createContext<Context>({
  addRef: () => ({
    current: null
  }),
  equalHeight: "auto",
  updateRef: () => {}
});

const EqualHeights = ({ children }: { children: React.ReactNode }) => {
  const [equalHeight, setEqualHeight] = useState<number | "auto">("auto");
  // TODO: This should be HTMLElement but for some reason it complains.
  const refs = useRef<Record<string | number, RefObject<any>>>({});

  const setHeights = useCallback(() => {
    const offsetHeights = Object.values(refs.current)
      .map((ref) => ref.current.clientHeight)
      .filter(Boolean);

    const newEqualHeight: number | "auto" = offsetHeights.length
      ? Math.max(...offsetHeights)
      : "auto";

    if (newEqualHeight !== equalHeight) {
      setEqualHeight(newEqualHeight);
    }
  }, [refs]);

  useEffect(() => {
    setHeights();
  }, [refs]);

  useEffect(() => {
    const windowResizeListener = () => {
      setHeights();
    };

    window.addEventListener("resize", windowResizeListener);

    return () => {
      window.removeEventListener("resize", windowResizeListener);
    };
  }, []);

  const addRef = (id: string | number) => {
    // eslint-disable-next-line security/detect-object-injection
    refs.current[id] = refs.current[id] || { current: null };
    // eslint-disable-next-line security/detect-object-injection
    return refs.current[id];
  };

  return (
    <div className={styles["EqualHeights"]}>
      <EqualHeightsContext.Provider
        value={{ addRef, updateRef: setHeights, equalHeight }}
      >
        {children}
      </EqualHeightsContext.Provider>
    </div>
  );
};

const EqualHeightsConsumer = ({
  children,
  shouldDisableBoxSizing,
  component: Component = "div"
}: ConsumerProps<Context> & {
  shouldDisableBoxSizing?: boolean;
  component?: React.ElementType;
}) => {
  return (
    <Component
      className={classnames({
        [styles["content-box"]!]: shouldDisableBoxSizing
      })}
    >
      <EqualHeightsContext.Consumer>{children}</EqualHeightsContext.Consumer>
    </Component>
  );
};

EqualHeights.Consumer = EqualHeightsConsumer;

export default EqualHeights;
