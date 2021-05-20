import React from "react";
import { Basic } from "../MediaGrid/index.stories";
import { TabCard } from "../Cards/TabCard";
import { Layout, LayoutProps } from ".";

export default {
  title: "Pages/Tools",
  component: Layout,
  argTypes: {
    title: { control: "text" }
  }
};

export const ToolsPage = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <TabCard>
      <Basic />
    </TabCard>
  </Layout>
);

ToolsPage.args = {
  title: "Tools"
};
