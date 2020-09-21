import React from "react";
import BmiThemeProvider from "@bmi/theme-provider";
import { Helmet } from "react-helmet";
import Footer from "./Footer";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const Page = ({ title, children }: Props) => {
  return (
    <BmiThemeProvider>
      <Helmet title={title} />
      {children}
      <Footer />
    </BmiThemeProvider>
  );
};

export default Page;
