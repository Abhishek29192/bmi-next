import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import { Helmet } from "react-helmet";
import Footer from "./Footer";
import Header from "./Header";
import { StyledPage } from "./styles/PageStyles";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const Page = ({ title, children }: Props) => {
  return (
    <ThemeProvider>
      <Helmet title={title} />
      <StyledPage>
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
      </StyledPage>
    </ThemeProvider>
  );
};

export default Page;
