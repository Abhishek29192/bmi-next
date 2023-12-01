// istanbul ignore file: ResizeObserver is not supported by jest
import { useEffect, useState } from "react";
import { useIsClient } from "@bmi-digital/components/hooks";

export const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setHeaderHeight(rect.height);
    });
    resizeObserver.observe(document.querySelector("header"));
    return () => resizeObserver.unobserve(document.querySelector("header"));
  }, [isClient]);

  return headerHeight;
};
