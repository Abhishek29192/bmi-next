import { render } from "@testing-library/react";
import React from "react";
import ThemeProvider from "../theme-provider";

export const renderWithThemeProvider = (
  children: React.ReactElement
): ReturnType<typeof render> => render(children, { wrapper: ThemeProvider });
