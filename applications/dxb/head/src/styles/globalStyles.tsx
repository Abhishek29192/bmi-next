import { GlobalStyles } from "@mui/material";
import React from "react";

export const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      body: {
        color: theme.colours.charcoal,
        margin: "0",
        fontSize: "1.125rem",
        fontFamily: "Effra Regular",
        fontWeight: "400",
        lineHeight: "1.4",
        backgroundColor: theme.colours.alabasterA
      },
      "@media print": {
        body: {
          backgroundColor: theme.colours.bodyBgBase
        }
      },
      "body::backdrop": {
        backgroundColor: theme.colours.alabasterA
      }
    })}
  />
);
