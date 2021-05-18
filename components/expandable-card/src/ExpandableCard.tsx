import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  CSSProperties,
  useCallback,
  useLayoutEffect
} from "react";
import DefaultCard, { CardContent } from "@bmi/card";
import Button from "@bmi/button";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@bmi/typography";
import classnames from "classnames";
import styles from "./ExpandableCard.module.scss";
import listStyles from "./ExpandableCardList.module.scss";

type CardItem = {
  icon: SVGImport;
  title: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  closeLabel?: string;
  isExpanded?: boolean;
};
export type Props = CardItem & {
  cardComponent?: React.ComponentType<any>; // TODO
  className?: string;
  onClick?: () => void;
  onCloseClick?: () => void;
  onAnimationEnd?: (isExpanded: boolean) => void;
};

const getChildrenHeight = (element: HTMLElement): number => {
  return Array.from(element.children).reduce((count, child) => {
    return count + child.clientHeight;
  }, -48); // TODO: Height of the X, should not calculate absolute positioned elements/
};

type AnimationStatus = "START" | "PROGRESS" | "END";

const getStyleFromAnimationStatus = (
  element: HTMLElement,
  animationStatus: AnimationStatus,
  isExpanded: boolean
): CSSProperties => {
  if (!element) {
    return {
      minHeight: "100%"
    };
  }

  const fixedPositionStyle = {
    position: "absolute",
    minHeight: "auto",
    height: element.parentElement.offsetHeight,
    top: element.parentElement.offsetTop,
    right:
      element.parentElement.parentElement.offsetWidth -
      (element.parentElement.offsetLeft + element.parentElement.offsetWidth),
    left: element.parentElement.offsetLeft
  };

  const progressToStyleMap = {
    expanding: {
      START: fixedPositionStyle,
      PROGRESS: {
        height: element.offsetHeight,
        top: 0,
        right: 0,
        left: 0
      },
      END: {
        height: Math.max(
          element.parentElement.parentElement.offsetHeight,
          getChildrenHeight(element)
        )
      }
    },
    collapsing: {
      START: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        height: Math.max(
          element.offsetHeight,
          element.parentElement.parentElement.offsetHeight
        )
      },
      PROGRESS: fixedPositionStyle,
      END: {
        minHeight: "100%"
      }
    }
  };

  return progressToStyleMap[isExpanded ? "expanding" : "collapsing"][
    animationStatus
  ] as CSSProperties;
};

const ExpandableCard = ({
  icon: Icon,
  cardComponent: Card = DefaultCard,
  className,
  title,
  body,
  footer,
  closeLabel = "Close",
  isExpanded: initialIsExpanded,
  onClick,
  onCloseClick,
  onAnimationEnd
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialIsExpanded);
  const [wrapperSize, setWrapperSize] = useState<{
    minWidth?: string;
    height?: string;
  }>({});
  const [, setForceRerender] = useState(false);
  const cardElement = useRef<HTMLElement>(null);
  const [animationStatus, setAnimationStatus] =
    useState<AnimationStatus>("END");
  const handleTransitionEnd = useCallback(
    (propertyName: string) => {
      if (propertyName === "height") {
        setAnimationStatus("END");

        if (onAnimationEnd) {
          onAnimationEnd(isExpanded);
        }
      }
    },
    [isExpanded]
  );

  useLayoutEffect(() => {
    const doneResizing = () => {
      setForceRerender((previous) => !previous);
    };
    let resizeId;
    const onResize = () => {
      clearTimeout(resizeId);
      resizeId = setTimeout(doneResizing, 500);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (animationStatus === "START") {
      setAnimationStatus("PROGRESS");

      if (isExpanded && cardElement.current) {
        setWrapperSize({
          minWidth: `${cardElement.current.parentElement.offsetWidth}px`,
          height: `${cardElement.current.parentElement.offsetHeight}px`
        });
      }
    }

    if (animationStatus === "END" && !isExpanded) {
      setWrapperSize({});
    }

    if (initialIsExpanded !== isExpanded) {
      if (initialIsExpanded) {
        setWrapperSize({
          minWidth: `${cardElement.current.parentElement.offsetWidth}px`,
          height: `${cardElement.current.parentElement.offsetHeight}px`
        });
      }

      setIsExpanded(initialIsExpanded);
      setAnimationStatus("START");
    }
  }, [initialIsExpanded, animationStatus]);

  return (
    <div className={className} style={wrapperSize}>
      <Card
        role="button"
        aria-label={title}
        onTransitionEnd={({ propertyName }) =>
          handleTransitionEnd(propertyName)
        }
        className={classnames(styles["ExpandableCard"], {
          [styles["ExpandableCard--expanded"]]: isExpanded
        })}
        style={{
          ...getStyleFromAnimationStatus(
            cardElement.current,
            animationStatus,
            isExpanded
          ),
          pointerEvents: onClick ? undefined : "auto"
        }}
        onClick={onClick}
        ref={cardElement}
      >
        {onCloseClick && (
          <Button
            accessibilityLabel={closeLabel}
            isIconButton
            variant="text"
            onClick={onCloseClick}
            className={styles["close"]}
          >
            <CloseIcon />
          </Button>
        )}
        <CardContent className={styles["content"]}>
          <div className={styles["header"]}>
            <Icon className={styles["icon"]} />
            <Typography
              variant="h5"
              className={classnames(styles["title"], {
                [styles["title--static"]]: !isExpanded && !wrapperSize.height
              })}
            >
              {title}
            </Typography>
          </div>
          <div className={styles["body"]}>{body}</div>
          {footer && <div className={styles["footer"]}>{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

const ExpandableCardList = ({
  items,
  className,
  cardComponent
}: {
  items: readonly CardItem[];
  className?: string;
  cardComponent?: React.ComponentType<any>; // TODO
}) => {
  const expandedItems = useMemo(
    () =>
      items.filter(({ isExpanded }) => isExpanded).map((_item, index) => index),
    [items]
  );
  const [expandedItem, setExpandedItem] = useState<number>(
    expandedItems.length ? expandedItems[0] : -1
  );

  /* istanbul ignore next */
  if (expandedItems.length > 1 && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn(
      "ExpandableCard.List: Only one card can be expanded at time. Using the first available instead."
    );
  }

  return (
    <div className={classnames(listStyles["ExpandableCardList"], className)}>
      {items.map((props, key) => (
        <ExpandableCard
          {...props}
          cardComponent={cardComponent}
          className={listStyles["item"]}
          key={key}
          isExpanded={expandedItem === key}
          onClick={() => {
            if (expandedItem === key) {
              return;
            }

            setExpandedItem(key);
          }}
          onCloseClick={() => {
            setExpandedItem(-1);
          }}
        />
      ))}
    </div>
  );
};

ExpandableCard.List = ExpandableCardList;

export default ExpandableCard;
