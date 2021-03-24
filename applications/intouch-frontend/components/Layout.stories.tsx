import React from "react";
import Layout, { LayoutProps } from "./Layout";

export default {
  title: "Layout",
  component: Layout,
  argTypes: {
    title: { control: "text" }
  }
};

export const Basic = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <div>Child content</div>
  </Layout>
);

Basic.args = {
  title: "Basic Layout"
};
