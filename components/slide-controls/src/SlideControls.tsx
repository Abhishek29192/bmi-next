import React, { useState } from "react";
import classnames from "classnames";
import Button from "@bmi/button";
import ChevronTopIcon from "@material-ui/icons/KeyboardArrowUp";
import ChevronRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ChevronBottomIcon from "@material-ui/icons/KeyboardArrowDown";
import ChevronLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import styles from "./SlideControls.module.scss";

type Props = {
  current?: number;
  total: number;
  onNextClick?: () => void;
  onPrevClick?: () => void;
  isFullSize?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  isVertical?: boolean;
  isDarkThemed?: boolean;
};

// NOTE: This won't work for 3 digit numbers.
const addZero = (number: number): string => ("0" + number).slice(-2);

type Direction = "none" | "forward" | "backward";

const getDirection = (
  current: number,
  newCurrent: number,
  total: number
): Direction => {
  if (current === newCurrent) {
    return "none";
  }

  if (current === total && newCurrent === 1) {
    return "forward";
  }

  if (current === 1 && newCurrent === total) {
    return "backward";
  }

  return current < newCurrent ? "forward" : "backward";
};

const getNumbers = (
  current: number,
  newCurrent: number,
  direction: Direction
): readonly number[] => {
  if (direction === "none") {
    return [current];
  }

  if (direction === "forward") {
    return [current, newCurrent];
  }

  return [newCurrent, current];
};

const SlideControls = ({
  current: initialCurrent = 1,
  total,
  onNextClick,
  onPrevClick,
  isFullSize,
  previousLabel = "previous",
  nextLabel = "next",
  isVertical,
  isDarkThemed
}: Props) => {
  const newCurrent = Math.min(initialCurrent, total);
  const [current, setCurrent] = useState<number>(newCurrent);
  const PreviousArrow = isVertical ? ChevronTopIcon : ChevronLeftIcon;
  const NextArrow = isVertical ? ChevronBottomIcon : ChevronRightIcon;

  /* istanbul ignore next */
  if (process.env.NODE_ENV === "development" && initialCurrent > total) {
    // eslint-disable-next-line no-console
    console.warn(
      `SlideControls: current (${initialCurrent}) can't be more than total (${total}). The total will be used instead.`
    );
  }

  const direction = getDirection(current, newCurrent, total);
  const numbers = getNumbers(current, newCurrent, direction);

  return (
    <div
      className={classnames(styles["SlideControls"], {
        [styles["SlideControls--full-size"]]: isFullSize && !isVertical,
        [styles["SlideControls--vertical"]]: isVertical,
        [styles["SlideControls--light"]]: isDarkThemed
      })}
    >
      <Button
        variant="text"
        isIconButton
        onClick={() => {
          if (newCurrent === current && onPrevClick) {
            onPrevClick();
          }
        }}
        accessibilityLabel={previousLabel}
      >
        <PreviousArrow className={styles["chevron"]} />
      </Button>
      <span className={styles["middle-container"]}>
        <span className={styles["sliding-slot"]}>
          <span
            className={classnames(styles["numbers"], {
              [styles[`numbers--${direction === "backward" ? "down" : "up"}`]]:
                direction !== "none"
            })}
          >
            {numbers.map((number, key) => (
              <span
                key={key}
                className={classnames(styles["number"], {
                  [styles["number--active"]]: number === newCurrent
                })}
                onAnimationEnd={() => {
                  if (newCurrent !== current) {
                    setCurrent(newCurrent);
                  }
                }}
              >
                {addZero(number)}
              </span>
            ))}
          </span>
        </span>
        <span className={styles["total"]}>{addZero(total)}</span>
      </span>
      <Button
        variant="text"
        isIconButton
        onClick={() => {
          if (newCurrent === current && onNextClick) {
            onNextClick();
          }
        }}
        accessibilityLabel={nextLabel}
      >
        <NextArrow className={styles["chevron"]} />
      </Button>
    </div>
  );
};

export default SlideControls;

export const StateSlideControls = ({
  current: initialCurrent = 1,
  total,
  onPrevClick,
  onNextClick,
  ...rest
}: Props) => {
  const [current, setCurrent] = useState<number>(initialCurrent);

  return (
    <SlideControls
      current={current}
      total={total}
      {...rest}
      onPrevClick={() => {
        setCurrent((current) => {
          if (current - 1 === 0) {
            return total;
          }

          return current - 1;
        });

        if (onPrevClick) {
          onPrevClick();
        }
      }}
      onNextClick={() => {
        setCurrent((current) => {
          if (current + 1 > total) {
            return 1;
          }
          return current + 1;
        });

        if (onNextClick) {
          onNextClick();
        }
      }}
    />
  );
};
