import React from "react";
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
      {/* media grid goes here once we've ironed out the bugs */}
    </TabCard>
  </Layout>
);

ToolsPage.args = {
  title: "Tools"
};