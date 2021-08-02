import React, { createContext, useEffect, useState } from "react";
import MicroCopy from "@bmi/micro-copy";
import PitchedRoofCalculator, {
  no,
  sampleData,
  Data
} from "@bmi/pitched-roof-calculator";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { devLog } from "../utils/devLog";
import { pushToDataLayer } from "../utils/google-tag-manager";

type Parameters = {
  isDebugging?: boolean;
};

type Context = {
  isOpen: boolean;
  open?: (params?: object) => void;
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
      if (!process.env.GATSBY_WEBTOOLS_CALCULATOR_DATA_URL) {
        devLog("Calculator data url was not found, using sample data instead.");
        setData(sampleData as Data);
        return;
      }

      try {
        const response = await axios.get(
          process.env.GATSBY_WEBTOOLS_CALCULATOR_DATA_URL,
          { cancelToken: cancelTokenSouce.token }
        );

        setData(response.data);
      } catch (error) {
        devLog(error);
        onError();
      }
    };

    fetchAndSetData();

    return () => cancelTokenSouce.cancel();
  }, [isOpen]);

  return (
    <CalculatorContext.Provider
      value={{
        isOpen,
        open:
          process.env.GATSBY_ENABLE_WEBTOOLS_CALCULATOR === "true"
            ? open
            : () => {}
      }}
    >
      {children}
      {/* Currently, this is only available for Norway */}
      <MicroCopy.Provider values={no}>
        <PitchedRoofCalculator
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          isDebugging={parameters?.isDebugging}
          data={data}
          onAnalyticsEvent={pushToDataLayer}
          sendEmailAddress={async (values) => {
            if (!process.env.GATSBY_WEBTOOLS_CALCULATOR_APSIS_ENDPOINT) {
              devLog(
                "WebTools calculator api endpoint for apsis isn't configured"
              );
              return;
            }

            const token = await executeRecaptcha();

            try {
              await axios.post(
                process.env.GATSBY_WEBTOOLS_CALCULATOR_APSIS_ENDPOINT,
                values,
                {
                  headers: {
                    "X-Recaptcha-Token": token
                  }
                }
              );
            } catch (error) {
              // Ignore errors if any as this isn't necessary for PDF download to proceed
              devLog("WebTools calculator api endpoint error", error);
            }
          }}
        />
      </MicroCopy.Provider>
    </CalculatorContext.Provider>
  );
};

export default CalculatorProvider;
