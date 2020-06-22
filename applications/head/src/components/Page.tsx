// TODO: Maybe move this in the component folder.

import React from "react";
// TODO: Remove `src` once !9 gets merged.
import BmiThemeProvider from "@bmi/theme-provider/src";

type Props = {
  children: React.ReactNode;
};

const Page = ({ children }: Props) => {
  return <BmiThemeProvider>{children}</BmiThemeProvider>;
};

export default Page;
