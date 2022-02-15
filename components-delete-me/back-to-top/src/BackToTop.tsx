import React, { useState, useEffect } from "react";
import { Button } from "@bmi-digital/components";
import UpArrow from "@material-ui/icons/ExpandLess";
import { Icon } from "@bmi-digital/components";
import classnames from "classnames";
import styles from "./BackToTop.module.scss";

type Props = {
  accessibilityLabel: string;
  className?: string;
};

const BackToTop = ({ accessibilityLabel, className }: Props) => {
  if (typeof window === "undefined") {
    return null;
  }

  const [isVisible, setIsVisible] = useState(false);

  const setScroll = () => {
    let newIsVisible = false;
    if (window.pageYOffset > 2 * window.innerHeight) {
      newIsVisible = true;
    }
    setIsVisible(newIsVisible);
  };

  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", setScroll, true);
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", setScroll, true);
    };
  }, []);
  return (
    <div
      className={classnames(className, styles["BackToTop"], {
        [styles["BackToTop--hidden"]!]: !isVisible
      })}
    >
      <Button
        aria-label={accessibilityLabel}
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
        onClick={() => {
          window.scrollTo({ top: 0 });
        }}
        className={styles["button"]}
      >
        <Icon source={UpArrow} className={styles["icon"]} />
      </Button>
    </div>
  );
};

export default BackToTop;
