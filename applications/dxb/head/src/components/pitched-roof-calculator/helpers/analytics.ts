import { createContext, useContext } from "react";

export type OnAnalyticsEvent = (event: {
  event?: string;
  id: string;
  label?: string;
  action?: string;
}) => void;

export const AnalyticsContext = createContext<OnAnalyticsEvent>(() => {
  // no-op
});

export const useAnalyticsContext = () => useContext(AnalyticsContext);
