import React from "react";
import BmiThemeProvider from "@bmi/theme-provider";
import { Helmet } from "react-helmet";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./Page.module.scss";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const Page = ({ title, children }: Props) => {
  return (
    <BmiThemeProvider>
      <Helmet title={title} />
      <div className={styles.Page}>
        <Header />
        {children}
        <Footer
          menu={[
            {
              label: "Third party Privacy notice",
              action: {
                model: "htmlLink",
                href:
                  "https://www.bmigroup.com/legal/third-party-privacy-notice"
              }
            },
            {
              label: "Cookie Policy",
              action: {
                model: "htmlLink",
                href: "https://www.bmigroup.com/legal/cookie-policy"
              }
            },
            {
              label: "Legal",
              action: {
                model: "htmlLink",
                href: "https://www.bmigroup.com/legal/legal"
              }
            }
          ]}
        />
      </div>
    </BmiThemeProvider>
  );
};

export default Page;
