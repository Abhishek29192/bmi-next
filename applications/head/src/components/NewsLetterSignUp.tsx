import React from "react";
import { graphql } from "gatsby";
import InputBanner from "@bmi/input-banner";

export type Data = {
  signUpTitle: string;
  signUpDescription: {
    signUpDescription: string;
  };
  signUpInputLabel: string;
  signUpCallToAction: string;
};

const NewsletterSignUp = ({ data }: { data?: Data }) => {
  if (!data) {
    return null;
  }

  const {
    signUpTitle,
    signUpDescription,
    signUpInputLabel,
    signUpCallToAction
  } = data;

  return (
    <InputBanner
      title={signUpTitle}
      description={signUpDescription.signUpDescription}
      inputLabel={signUpInputLabel}
      inputCallToAction={signUpCallToAction}
    />
  );
};

export default NewsletterSignUp;

export const query = graphql`
  fragment SignUpFragment on ContentfulSite {
    signUpTitle
    signUpDescription {
      signUpDescription
    }
    signUpInputLabel
    signUpCallToAction
  }
`;
