import { Button, ButtonProps, useIsClient } from "@bmi-digital/components";
import { ArrowBack as ArrowBackIcon } from "@bmi-digital/components/icon";
import { useMediaQuery, useTheme } from "@mui/material";
import React, { FC, ReactElement } from "react";
import { microCopy } from "../constants/microCopies";
import { getBackToResultsPath, PATHNAME_KEY } from "../utils/filters";
import withGTM from "../utils/google-tag-manager";
import { useSiteContext } from "./Site";
import styles from "./styles/BackToResults.module.scss";

const CTABackToResults = withGTM<ButtonProps>(Button);

interface Props {
  children: ReactElement;
  isDarkThemed?: boolean;
  "data-testid"?: string;
}

const BackToResults: FC<Props> = ({
  children,
  isDarkThemed = false,
  "data-testid": dataTestId
}: Props) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const { isClient } = useIsClient();

  const urlParams = new URLSearchParams(isClient ? window.location.search : "");
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  if (urlParams.get(PATHNAME_KEY)) {
    return (
      <div
        data-testid={dataTestId || "back-to-results-section"}
        className={styles["BackToResults"]}
      >
        <CTABackToResults
          startIcon={<ArrowBackIcon />}
          variant="text"
          hasDarkBackground={isDarkThemed}
          action={{
            model: "htmlLink",
            href: getBackToResultsPath(countryCode)
          }}
          gtm={{
            id: "nav-breadcrumb-back-to-results",
            action: getBackToResultsPath(countryCode),
            label: getMicroCopy(microCopy.SEARCH_BACK_TO_RESULTS)
          }}
          data-testid="back-to-results-button"
        >
          {getMicroCopy(microCopy.SEARCH_BACK_TO_RESULTS)}
        </CTABackToResults>
        {isDesktop && (
          <>
            <div
              data-testid="back-to-results-separator"
              className={styles["BackToResults--separator"]}
            />
            {children}
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default BackToResults;
