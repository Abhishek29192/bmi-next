import React from "react";
import { ActionTile, ActionTileProps } from ".";

export default {
  title: "Action Panel",
  component: ActionTile,
  argTypes: {
    title: { control: "text" },
    description: { control: "text" }
  }
};

export const Basic = ({ title, description }: ActionTileProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh"
    }}
  >
    <div style={{ width: "560px" }}>
      <ActionTile title={title} description={description} />
    </div>
  </div>
);

Basic.args = {
  title: "System Guarantee",
  description: "Guarantees a set of products that make up a system"
};
