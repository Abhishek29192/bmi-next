import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

export const useIsMobileDevice = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    typeof document !== "undefined" &&
    "ontouchstart" in document.documentElement &&
    isMobile
  );
};
