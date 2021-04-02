import React from "react";
import { Layout, LayoutProps } from ".";

export default {
  title: "Layout",
  component: Layout,
  argTypes: {
    title: { control: "text" }
  }
};

export const Basic = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <div
      style={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1rem",
        fontSize: "1rem"
      }}
    >
      &lt;childContent goes=here /&gt;
    </div>
  </Layout>
);

Basic.args = {
  title: "Basic Layout"
};
