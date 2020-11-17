import React from "react";
import styles from "./styles/Scrim.module.scss";

const Scrim = ({
  children,
  theme
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
}) => (
  <div className={[styles["Scrim"], styles[`Scrim--${theme}`]].join(" ")}>
    {children}
  </div>
);

export default Scrim;
