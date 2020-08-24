import React from "react";
import InputBanner from "@bmi/input-banner";
import { graphql } from "gatsby";

type NewsletterSignUpData = {
  title: string;
  description: string;
  inputLabel: string;
  inputCallToAction: string;
};

const NewsletterSignUp = ({ data }: { data?: NewsletterSignUpData }) => {
  if (!data) {
    return null;
  }

  return <InputBanner {...data} />;
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
