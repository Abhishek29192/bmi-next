import { useCallback, useEffect, useRef } from "react";

export const useScrollToOnLoad = (skip?: boolean, wait: number = 0) => {
  const ref = useRef<{
    node: HTMLDivElement | null;
    hasScrolled: boolean;
  }>({
    node: null,
    hasScrolled: false
  });

  const scrollIfPossible = useCallback(() => {
    if (skip || typeof window === "undefined") {
      return;
    }

    const scroll = () => {
      if (ref.current.node && !ref.current.hasScrolled) {
        const offsetY = -190; // Roughly the Header height
        const newY =
          ref.current.node.getBoundingClientRect().top +
          window.scrollY +
          offsetY;
        window.scrollTo(0, newY);

        ref.current.hasScrolled = true;
      }
    };

    // Wait for anys transitions
    window.setTimeout(scroll, wait);
  }, [skip, wait]);

  const setRef = useCallback(
    (node) => {
      ref.current.node = node;
      scrollIfPossible();
    },
    [scrollIfPossible]
  );

  useEffect(() => {
    scrollIfPossible();
  }, [ref.current.node, scrollIfPossible]);

  return setRef;
};
