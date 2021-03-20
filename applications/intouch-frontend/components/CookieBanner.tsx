import React from "react";
import styles from "./styles/CookieBanner.module.scss";

// WIP
type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const CookieBanner = ({ children }: Props) => (
  <div className={styles.cookieBanner}>{children}</div>
);

export default CookieBanner;
