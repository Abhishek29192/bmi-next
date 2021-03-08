import React from "react";
import styles from "./styles/CookieBanner.module.scss";

// interface Props {
//   children: React.ReactNode | React.ReactNode[];
// }

const CookieBanner = ({ children }: Props) => (
  <div className={styles.cookieBanner}>
    <p>
      The Roof Pro Portal of the BMI Group uses first-party and third-party
      cookies to ensure the functionality of the website. To find out more or
      change your cookie settings, please click here. By registering and using
      the Portal, you consent to our use of cookies. Find out more.
    </p>
  </div>
);

export default CookieBanner;
