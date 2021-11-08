import React from "react";
import { Header, HeaderProps } from ".";

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

export const AttentionHeading = ({ title, attentionHeading }: HeaderProps) => (
  <Header title={title} attentionHeading={attentionHeading} />
);

AttentionHeading.args = {
  title: "JS Roofers",
  attentionHeading: "Deactivated"
};
