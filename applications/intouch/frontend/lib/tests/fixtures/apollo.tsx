import React from "react";
import { MockedProvider } from "@apollo/client/testing";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <MockedProvider>{children}</MockedProvider>;
};

export default Provider;
