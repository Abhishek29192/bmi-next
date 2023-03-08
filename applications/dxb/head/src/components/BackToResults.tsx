import { Button, ButtonProps, QUERY_KEY } from "@bmi-digital/components";
import { ArrowBack as ArrowBackIcon } from "@bmi-digital/components/icon";
import { useMediaQuery, useTheme } from "@mui/material";
import React, { FC, ReactChild } from "react";
import { microCopy } from "../constants/microCopies";
import {
  FILTER_KEY,
  getBackToResultsPath,
  PATHNAME_KEY,
  SEARCHTAB_KEY
} from "../utils/filters";
import withGTM from "../utils/google-tag-manager";
import { useSiteContext } from "./Site";
import styles from "./styles/BackToResults.module.scss";

const CTABackToResults = withGTM<ButtonProps>(Button);

interface Props {
  children: ReactChild;
  isDarkThemed?: boolean;
}

const BackToResults: FC<Props> = ({
  children,
  isDarkThemed = false
}: Props) => {
  const { countryCode, getMicroCopy } = useSiteContext();

  const isSSR = typeof window === "undefined";

  const urlParams = new URLSearchParams(isSSR ? "" : window.location.search);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  if (
    !urlParams.get(QUERY_KEY) &&
    !urlParams.get(FILTER_KEY) &&
    !urlParams.get(PATHNAME_KEY) &&
    !urlParams.get(SEARCHTAB_KEY)
  ) {
    return <>{children}</>;
  }

  return (
    <div className={styles["BackToResults"]}>
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
      {!isMobile && (
        <>
          <div className={styles["BackToResults--separator"]} />
          {children}
        </>
      )}
    </div>
  );
};

export default BackToResults;
