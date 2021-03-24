import React from "react";
import { Header, HeaderProps } from "./Header";

export default {
  title: "Header",
  component: Header,
  argTypes: {
    title: { control: "text" }
  }
};

export const Basic = ({ title }: HeaderProps) => <Header title={title} />;

Basic.args = {
  title: "JS Roofers"
};
