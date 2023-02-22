import { ThemeProvider, useTheme } from "@mui/material/styles";
import { StylesOptions, StylesProvider } from "@mui/styles";
import React, { ReactElement } from "react";

const generateClassName: StylesOptions["generateClassName"] = (
  rule,
  sheet
): string => `${sheet!.options.classNamePrefix}-${rule.key}`;

type Props = {
  children: React.ReactNode;
};

const ProvideStyles = ({ children }: Props): ReactElement => {
  const defaultTheme = useTheme();
  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
    </StylesProvider>
  );
};
export default ProvideStyles;
