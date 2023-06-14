import { useEffect, useState } from "react";

const useHasScrollbar = () => {
  const [hasScrollbar, setHasScrollbar] = useState<boolean>(true);

  useEffect(() => {
    getHasScrollbar();
    window.addEventListener("resize", getHasScrollbar);

    return () => {
      window.removeEventListener("resize", getHasScrollbar);
    };
  }, []);

  const getHasScrollbar = () => {
    setHasScrollbar(window?.innerWidth !== document?.body.offsetWidth);
  };

  return hasScrollbar;
};

export default useHasScrollbar;
