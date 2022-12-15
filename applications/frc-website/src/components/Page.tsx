import { ThemeProvider } from "@bmi-digital/components";
import { CacheProvider } from "@emotion/react";
import React from "react";
import { Helmet } from "react-helmet";
import cache from "../get-emotion-cache";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Page.module.scss";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const Page = ({ title, children }: Props) => {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider>
        <Helmet title={title} />
        <div className={styles.Page}>
          <Header />
          {children}
          <Footer
            menu={[
              {
                label: "Third party privacy notice",
                action: {
                  model: "htmlLink",
                  href: "https://www.bmigroup.com/legal/third-party-privacy-notice"
                }
              },
              {
                label: "Cookie policy",
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
      </ThemeProvider>
    </CacheProvider>
  );
};

export default Page;
