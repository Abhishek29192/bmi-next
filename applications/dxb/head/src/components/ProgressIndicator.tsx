import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./styles/ProgressIndicator.module.scss";

const ProgressIndicator = ({ theme }: { theme: "light" | "dark" }) => (
  <CircularProgress
    size={72}
    // NOTE: Intended thickness is 6px for large spinner, but MUI apears twice as thicc
    thickness={3}
    className={[
      styles["ProgressIndicator"],
      styles[`ProgressIndicator--${theme}`]
    ].join(" ")}
  />
);

export default ProgressIndicator;
