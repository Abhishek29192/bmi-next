import { createContext } from "react";

export type OnAnalyticsEvent = (event: {
  id: string;
  label?: string;
  action?: string;
}) => void;

export const AnalyticsContext = createContext<OnAnalyticsEvent>(() => {});
