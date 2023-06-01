import fetch from "node-fetch";
import React, {
  createContext,
  Suspense,
  useEffect,
  useMemo,
  useState
} from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { useConfig } from "../contexts/ConfigProvider";
import { devLog } from "../utils/devLog";
import getCookie from "../utils/getCookie";
import { pushToDataLayer } from "../utils/google-tag-manager";
import { CalculatorConfig, Data } from "./pitched-roof-calculator/types";

const PitchedRoofCalculator = React.lazy(
  () => import("./pitched-roof-calculator/PitchedRoofCalculator")
);

type Parameters = {
  isDebugging?: boolean;
};

type Context = {
  isOpen: boolean;
  open?: (params?: Record<string, unknown>) => void;
};

export const CalculatorContext = createContext<Context>({
  isOpen: false,
  open: () => {
    devLog("Calculator: Something went wrong");
  }
});

type Props = {
  children: React.ReactNode;
  onError: () => void;
  calculatorConfig: CalculatorConfig | null;
};

const CalculatorProvider = ({ children, onError, calculatorConfig }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Data>();
  const [parameters, setParameters] = useState<Partial<Parameters>>({});
  const {
    webtoolsCalculatorDataUrl,
    isWebToolsCalculatorEnabled,
    webToolsCalculatorApsisEndpoint
  } = useConfig();
  const showCalculatorDialog = !(typeof window === "undefined") && isOpen;

  const open: Context["open"] = (params = {}) => {
    setParameters(params);
    setIsOpen(true);
  };

  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    const fetchAndSetData = async () => {
      if (!webtoolsCalculatorDataUrl) {
        devLog("Calculator data url was not found.");
        return;
      }

      try {
        const response = await fetch(webtoolsCalculatorDataUrl, {
          method: "GET",
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as Data;

        setData(data);
      } catch (error) {
        devLog({ message: error.message });
        onError();
      }
    };

    fetchAndSetData();

    return () => controller.abort();
  }, [isOpen, onError, webtoolsCalculatorDataUrl]);

  const calculatorProps = useMemo(
    () => ({
      isOpen,
      onClose: () => setIsOpen(false),
      isDebugging: parameters?.isDebugging,
      data,
      onAnalyticsEvent: pushToDataLayer,
      sendEmailAddress: async (values) => {
        if (!webToolsCalculatorApsisEndpoint) {
          devLog("WebTools calculator api endpoint for apsis isn't configured");
          return;
        }

        const token = qaAuthToken ? undefined : await executeRecaptcha?.();

        let headers: HeadersInit = {
          "Content-Type": "application/json",
          "X-Recaptcha-Token": token
        };
        if (qaAuthToken) {
          headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
        }
        try {
          const response = await fetch(webToolsCalculatorApsisEndpoint, {
            method: "POST",
            body: JSON.stringify(values),
            headers
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }
        } catch (error) {
          // Ignore errors if any as this isn't necessary for PDF download to proceed
          devLog("WebTools calculator api endpoint error", error);
        }
      }
    }),
    [
      data,
      isOpen,
      parameters,
      qaAuthToken,
      webToolsCalculatorApsisEndpoint,
      executeRecaptcha
    ]
  );

  if (!showCalculatorDialog || typeof window === "undefined") {
    return (
      <CalculatorContext.Provider
        value={{
          isOpen,
          open: isWebToolsCalculatorEnabled
            ? open
            : () => {
                // no-op
              }
        }}
      >
        {children}
      </CalculatorContext.Provider>
    );
  }

  return (
    <CalculatorContext.Provider
      value={{
        isOpen,
        open: isWebToolsCalculatorEnabled
          ? open
          : () => {
              // no-op
            }
      }}
    >
      {children}
      <Suspense fallback={<div>Loading...</div>}>
        <PitchedRoofCalculator
          {...calculatorProps}
          calculatorConfig={calculatorConfig}
        />
      </Suspense>
    </CalculatorContext.Provider>
  );
};

export default CalculatorProvider;
