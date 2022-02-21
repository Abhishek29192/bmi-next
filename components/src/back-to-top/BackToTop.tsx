import React, { useState, useEffect } from "react";
import { ExpandLess } from "@material-ui/icons";
import classnames from "classnames";
import Button from "../button/Button";
import Icon from "../icon/Icon";
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
        <Icon source={ExpandLess} className={styles["icon"]} />
      </Button>
    </div>
  );
};

export default BackToTop;
