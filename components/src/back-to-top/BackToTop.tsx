import { ExpandLess } from "@material-ui/icons";
import classnames from "classnames";
import React, { useEffect, useState } from "react";
import Button from "../button";
import Icon from "../icon";
import { useStyles } from "./styles";

type Props = {
  accessibilityLabel: string;
  className?: string;
};

const BackToTop = ({ accessibilityLabel, className }: Props) => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);

  if (typeof window === "undefined") {
    return null;
  }

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
      className={classnames(
        className,
        classes.root,
        !isVisible && classes.hidden
      )}
    >
      <Button
        aria-label={accessibilityLabel}
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
        onClick={() => {
          window.scrollTo({ top: 0 });
        }}
        className={classes.button}
      >
        <Icon source={ExpandLess} className={classes.icon} />
      </Button>
    </div>
  );
};

export default BackToTop;
