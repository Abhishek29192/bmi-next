import React, { useState } from "react";
import classnames from "classnames";
import { KeyboardArrowUp } from "@material-ui/icons";
import { KeyboardArrowRight } from "@material-ui/icons";
import { KeyboardArrowDown } from "@material-ui/icons";
import { KeyboardArrowLeft } from "@material-ui/icons";
import Button from "../button/Button";
import styles from "./SlideControls.module.scss";

export type Props = {
  current?: number;
  total: number;
  onNextClick?: (current: number) => void;
  onPrevClick?: (current: number) => void;
  onChange?: (current: number) => void;
  isFullSize?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  isVertical?: boolean;
  isDarkThemed?: boolean;
  className?: string;
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

  if (total === 2) {
    return "forward";
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
  onChange,
  isFullSize,
  previousLabel = "previous",
  nextLabel = "next",
  isVertical,
  isDarkThemed,
  className
}: Props) => {
  const newCurrent = Math.min(initialCurrent, total);
  const [current, setCurrent] = useState<number>(newCurrent);
  const PreviousArrow = isVertical ? KeyboardArrowUp : KeyboardArrowLeft;
  const NextArrow = isVertical ? KeyboardArrowDown : KeyboardArrowRight;

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
      className={classnames(
        styles["SlideControls"],
        {
          [styles["SlideControls--full-size"]!]: isFullSize && !isVertical,
          [styles["SlideControls--vertical"]!]: isVertical,
          [styles["SlideControls--light"]!]: isDarkThemed
        },
        className
      )}
    >
      {total > 1 && (
        <Button
          variant="text"
          hasDarkBackground={isDarkThemed}
          isIconButton
          onClick={() => {
            if (numbers.length === 1) {
              onPrevClick && onPrevClick(current);
              onChange && onChange(current);
            }
          }}
          accessibilityLabel={previousLabel}
        >
          <PreviousArrow className={styles["chevron"]} />
        </Button>
      )}
      <span className={styles["middle-container"]}>
        <span className={styles["sliding-slot"]}>
          <span
            className={classnames(styles["numbers"], {
              [styles[`numbers--${direction === "backward" ? "down" : "up"}`]!]:
                direction !== "none"
            })}
          >
            {numbers.map((number, key) => (
              <span
                key={key}
                className={classnames(styles["number"], {
                  [styles["number--active"]!]: number === newCurrent
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
      {total > 1 && (
        <Button
          variant="text"
          hasDarkBackground={isDarkThemed}
          isIconButton
          onClick={() => {
            if (numbers.length === 1) {
              onNextClick && onNextClick(current);
              onChange && onChange(current);
            }
          }}
          accessibilityLabel={nextLabel}
        >
          <NextArrow className={styles["chevron"]} />
        </Button>
      )}
    </div>
  );
};

export default SlideControls;

export const StateSlideControls = ({
  current: initialCurrent = 1,
  total,
  onPrevClick,
  onNextClick,
  onChange,
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
          onPrevClick(current);
        }

        if (onChange) {
          onChange(current);
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
          onNextClick(current);
        }

        if (onChange) {
          onChange(current);
        }
      }}
    />
  );
};
