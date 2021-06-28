import React, { createContext, useState } from "react";
import MicroCopy from "@bmi/micro-copy";
import PitchedRoofCalculator, { no } from "@bmi/pitched-roof-calculator";
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
};

const CalculatorProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [parameters, setParameters] = useState<Partial<Parameters>>({});

  const open: Context["open"] = (params = {}) => {
    setParameters(params);
    setIsOpen(true);
  };

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
          onAnalyticsEvent={pushToDataLayer}
          isDebugging={parameters?.isDebugging}
        />
      </MicroCopy.Provider>
    </CalculatorContext.Provider>
  );
};

export default CalculatorProvider;
