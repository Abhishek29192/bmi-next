import React from "react";
import { ThreeColumnGrid } from "../ThreeColumnGrid";
import { Team } from "../SidePanel/index.stories";
import { Empty, HasTable } from "../TableContainer/index.stories";
import { MikeHarold } from "../UserCard/index.stories";
import { Layout, LayoutProps } from ".";

export default {
  title: "Pages/Team",
  component: Layout,
  argTypes: {
    title: { control: "text" }
  }
};

export const TeamPage = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <div style={{ display: "flex" }}>
      <Team />

      <ThreeColumnGrid>
        {/* TODO: This needs standardising, probably with classes */}
        <div style={{ flex: 2, minWidth: "400px" }}>
          <Empty />
          <HasTable />
        </div>
        <MikeHarold />
      </ThreeColumnGrid>
    </div>
  </Layout>
);

TeamPage.args = {
  title: "Team"
};
