import React from "react";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";

const RecaptchaPrivacyLinks = () => (
  <Typography className="RecaptchaPrivacyLinks">
    This site is protected by reCAPTCHA and the Google{" "}
    <AnchorLink
      action={{
        model: "htmlLink",
        href: "https://policies.google.com/privacy"
      }}
    >
      Privacy Policy
    </AnchorLink>{" "}
    and{" "}
    <AnchorLink
      action={{
        model: "htmlLink",
        href: "https://policies.google.com/terms"
      }}
    >
      Terms of Service
    </AnchorLink>{" "}
    apply.
  </Typography>
);

export default RecaptchaPrivacyLinks;
