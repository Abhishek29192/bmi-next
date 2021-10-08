import React from "react";
import { graphql } from "gatsby";

export type Data = {
  __typename: "SampleBasketSection";
  title: string;
  description: string;
};

const SampleBasetSection = ({
  data: { title, description }
}: {
  data: Data;
}) => {
  return <h1>{title}</h1>;
};

export default SampleBasetSection;

export const query = graphql`
  fragment SampleBasketSectionFragment on ContentfulSampleBasketSection {
    title
  }
`;
