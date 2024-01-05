import GlobalStyles from "@mui/material/GlobalStyles";
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
        backgroundColor: theme.colours.white
      },
      "@media print": {
        body: {
          backgroundColor: theme.colours.white
        }
      },
      "body::backdrop": {
        backgroundColor: theme.colours.white
      }
      // Copied from global.css - are these even needed?
      // html: {
      //   boxSizing: "border-box",
      //   "-webkit-font-smoothing": "antialiased",
      //   "-moz-osx-font-smoothing": "grayscale"
      // },
      // "*, *::before, *::after": {
      //   boxSizing: "inherit"
      // },
      // b: {
      //   fontWeight: 700
      // },
      // ".grecaptcha-badge": {
      //   visibility: "hidden"
      // }
    })}
  />
);
