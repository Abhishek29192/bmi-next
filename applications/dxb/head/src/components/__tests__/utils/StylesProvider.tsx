import React, { ReactElement } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { StylesProvider, StylesOptions } from "@material-ui/styles";
import { useTheme } from "@material-ui/core/styles";

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
      <MuiThemeProvider theme={defaultTheme}>{children}</MuiThemeProvider>
    </StylesProvider>
  );
};
export default ProvideStyles;
