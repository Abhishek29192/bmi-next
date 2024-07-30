import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const useRouteUpdate = (onRouteUpdate: (url: string) => void) => {
  const pathname = usePathname();
  const searchParams =
    typeof window !== "undefined" ? window.location.search : null;

  const [prevPath, setPrevPath] = useState(pathname);
  const [prevParams, setPrevParams] = useState(searchParams);

  const pathChangeCount = useRef<number>(0);

  useEffect(() => {
    pathChangeCount.current += 1;
    if (
      pathname !== prevPath ||
      prevParams !== searchParams ||
      pathChangeCount.current === 1
    ) {
      onRouteUpdate(pathname);
      setPrevPath(pathname);
      setPrevParams(searchParams);
      window.addEventListener("hashchange", () => onRouteUpdate(pathname));
    }

    return () =>
      window.removeEventListener("hashchange", () => onRouteUpdate(pathname));
  }, [pathname, prevPath, searchParams, onRouteUpdate]);
};

export default useRouteUpdate;
