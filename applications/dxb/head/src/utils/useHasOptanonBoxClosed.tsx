import { useIsClient } from "@bmi-digital/components";
import { useCookie } from "@lilib/hooks";
import { useEffect, useState } from "react";

export const useHasOptanonBoxClosed = (configuredCookieClasses: string[]) => {
  const [hasAcceptedOptanonCookie, setHasAcceptedOptanonCookie] =
    useState(false);
  const [cookiePolling, setCookiePolling] = useState(true);
  const { isClient } = useIsClient();

  //cookie `OptanonAlertBoxClosed` should return date time in the format `2023-04-03T16:44:45.955Z`
  const [value] = useCookie("OptanonAlertBoxClosed", {
    pollingInterval: 1000,
    defaultValue: "",
    polling: cookiePolling
  });

  useEffect(() => {
    const optanonAlertBoxClosed = value;

    if (
      isClient &&
      (configuredCookieClasses.length === 0 || optanonAlertBoxClosed.length > 0)
    ) {
      setHasAcceptedOptanonCookie(true);
      setCookiePolling(false);
    }
  }, [configuredCookieClasses, isClient, value]);
  return { hasAcceptedOptanonCookie };
};
