import { MicroCopy } from "@bmi-digital/components";
import logger from "@bmi-digital/functions-logger";
import fetch from "node-fetch";
import React, {
  createContext,
  Suspense,
  useEffect,
  useMemo,
  useState
} from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useConfig } from "../contexts/ConfigProvider";
import { devLog } from "../utils/devLog";
import { pushToDataLayer } from "../utils/google-tag-manager";
import no from "./pitched-roof-calculator/samples/copy/no.json";
import sampleData from "./pitched-roof-calculator/samples/data.json";
import { CalculatorConfig, Data } from "./pitched-roof-calculator/types";

const PitchedRoofCalculatorV1 = React.lazy(
  () => import("./pitched-roof-calculator/v1/PitchedRoofCalculator")
);

const PitchedRoofCalculatorV2 = React.lazy(
  () => import("./pitched-roof-calculator/v2/PitchedRoofCalculator")
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
    config: {
      webtoolsCalculatorDataUrl,
      isWebToolsCalculatorEnabled,
      webToolsCalculatorApsisEndpoint,
      isV2WebToolsCalculatorEnabled
    }
  } = useConfig();
  const showCalculatorDialog = !(typeof window === "undefined") && isOpen;

  const open: Context["open"] = (params = {}) => {
    setParameters(params);
    setIsOpen(true);
  };

  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    const fetchAndSetData = async () => {
      if (!webtoolsCalculatorDataUrl) {
        devLog("Calculator data url was not found, using sample data instead.");
        setData(sampleData as Data);
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

        const data = await response.json();

        setData(data);
      } catch (error) {
        logger.error({ message: error.message });
        onError();
      }
    };

    fetchAndSetData();

    return () => controller.abort();
  }, [isOpen]);

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

        const token = await executeRecaptcha();

        try {
          const response = await fetch(webToolsCalculatorApsisEndpoint, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "X-Recaptcha-Token": token,
              "Content-Type": "application/json"
            }
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
    [data, isOpen, parameters]
  );

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
      {/* Currently, this is only available for Norway */}
      {!showCalculatorDialog ? null : isV2WebToolsCalculatorEnabled ? (
        <Suspense fallback={<div>Loading...</div>}>
          <PitchedRoofCalculatorV2
            {...calculatorProps}
            calculatorConfig={calculatorConfig}
          />
        </Suspense>
      ) : (
        <MicroCopy.Provider values={no}>
          <Suspense fallback={<div>Loading...</div>}>
            <PitchedRoofCalculatorV1 {...calculatorProps} />
          </Suspense>
        </MicroCopy.Provider>
      )}
    </CalculatorContext.Provider>
  );
};

export default CalculatorProvider;
