import { MicroCopy } from "@bmi/components";
import axios from "axios";
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
import { Data } from "./pitched-roof-calculator/types";

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
};

const CalculatorProvider = ({ children, onError }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const [data, setData] = useState<Data>();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const cancelTokenSouce = axios.CancelToken.source();

    const fetchAndSetData = async () => {
      if (!webtoolsCalculatorDataUrl) {
        devLog("Calculator data url was not found, using sample data instead.");
        setData(sampleData as Data);
        return;
      }

      try {
        const response = await axios.get(webtoolsCalculatorDataUrl, {
          cancelToken: cancelTokenSouce.token
        });

        setData(response.data);
      } catch (error) {
        devLog(error);
        onError();
      }
    };

    fetchAndSetData();

    return () => cancelTokenSouce.cancel();
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
          await axios.post(webToolsCalculatorApsisEndpoint, values, {
            headers: {
              "X-Recaptcha-Token": token
            }
          });
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
          <PitchedRoofCalculatorV2 {...calculatorProps} />
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
