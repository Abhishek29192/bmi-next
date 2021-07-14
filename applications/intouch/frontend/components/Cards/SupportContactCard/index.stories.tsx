import React from "react";
import { mockContactDetailsCollection } from "../../../fixtures/contentful/contactDetails";
import { SupportContactCard } from ".";

export default {
  title: "SupportContactCard",
  component: SupportContactCard
};

export const Basic = () => (
  <SupportContactCard contactDetailsCollection={mockContactDetailsCollection} />
);
