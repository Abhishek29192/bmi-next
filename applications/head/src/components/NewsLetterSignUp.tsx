import React from "react";
import { graphql } from "gatsby";
import InputBanner from "@bmi/input-banner";

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
