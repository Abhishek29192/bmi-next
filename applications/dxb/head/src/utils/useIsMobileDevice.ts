import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const useIsMobileDevice = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    typeof document !== "undefined" &&
    "ontouchstart" in document.documentElement &&
    isMobile
  );
};
