import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const useRouteUpdate = (onRouteUpdate: (url: string) => void) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [prevPath, setPrevPath] = useState(pathname);
  const [prevParams, setPrevParams] = useState(searchParams.toString());

  const pathChangeCount = useRef<number>(0);

  useEffect(() => {
    pathChangeCount.current += 1;
    if (
      pathname !== prevPath ||
      prevParams !== searchParams.toString() ||
      pathChangeCount.current === 1
    ) {
      onRouteUpdate(pathname);
      setPrevPath(pathname);
      setPrevParams(searchParams.toString());
      window.addEventListener("hashchange", () => onRouteUpdate(pathname));
    }

    return () =>
      window.removeEventListener("hashchange", () => onRouteUpdate(pathname));
  }, [pathname, prevPath, searchParams, onRouteUpdate]);
};

export default useRouteUpdate;
