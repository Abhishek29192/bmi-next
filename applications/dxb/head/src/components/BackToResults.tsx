import Button, { ButtonProps } from "@bmi-digital/components/button";
import { useIsClient } from "@bmi-digital/components/hooks";
import ArrowBackIcon from "@bmi-digital/components/icon/ArrowBack";
import { microCopy } from "@bmi/microcopies";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { FC, ReactElement } from "react";
import { PATHNAME_KEY, getBackToResultsPath } from "../utils/filters";
import withGTM from "../utils/google-tag-manager";
import { useSiteContext } from "./Site";
import {
  BackToResultsElement,
  BackToResultsSeparator
} from "./styles/BackToResultsStyles";

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
      <BackToResultsElement
        data-testid={dataTestId || "back-to-results-section"}
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
            <BackToResultsSeparator data-testid="back-to-results-separator" />
            {children}
          </>
        )}
      </BackToResultsElement>
    );
  }

  return <>{children}</>;
};

export default BackToResults;
