import { microCopy } from "@bmi/microcopies";
import React, { useEffect, useRef, useState } from "react";
import { useSiteContext } from "../../../components/Site";
import {
  MobileStickyContainer,
  SeeAllSessionButton,
  classes
} from "./MobileStickyFooterStyles";

type MobileStickyFooterProps = {
  disabled: boolean;
  scrollToSessions: () => void;
};

const getIsFooterSticky = (footerNode: HTMLDivElement | null) => {
  const windowHeight = window.innerHeight;
  const stickyFooterPosition = footerNode?.getBoundingClientRect().bottom;

  return windowHeight === stickyFooterPosition;
};

const MobileStickyFooter = (props: MobileStickyFooterProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const stickyContainerRef = useRef<HTMLDivElement | null>(null);
  const { getMicroCopy } = useSiteContext();

  useEffect(() => {
    const isSticky = getIsFooterSticky(stickyContainerRef.current);
    setIsSticky(isSticky);

    const handleScroll = () => {
      const isSticky = getIsFooterSticky(stickyContainerRef.current);
      setIsSticky(isSticky);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MobileStickyContainer
      data-testid="mobile-sticky-footer"
      ref={stickyContainerRef}
      className={isSticky ? classes.sticky : undefined}
    >
      <SeeAllSessionButton
        onClick={props.scrollToSessions}
        disabled={props.disabled}
        variant="contained"
        data-testid="scroll-to-available-sessions-button"
      >
        {getMicroCopy(microCopy.TRAINING_DETAILS_SEE_AVAILABLE_SESSIONS_BUTTON)}
      </SeeAllSessionButton>
    </MobileStickyContainer>
  );
};

export default MobileStickyFooter;
