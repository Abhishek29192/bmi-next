import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useIsMobileDevice = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    typeof document !== "undefined" &&
    "ontouchstart" in document.documentElement &&
    isMobile
  );
};
