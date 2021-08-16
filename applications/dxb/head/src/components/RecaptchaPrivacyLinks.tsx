import React, { useMemo } from "react";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
import getRecaptchaPrivacyContent, {
  RecaptchaPolicyContentType
} from "./RecaptchaContentProvider";
import { useSiteContext } from "./Site";

const RecaptchaPrivacyLinks = () => {
  const { countryCode } = useSiteContext();

  return useMemo(() => {
    const recaptchaContent: RecaptchaPolicyContentType =
      getRecaptchaPrivacyContent(countryCode);
    return (
      <Typography className="RecaptchaPrivacyLinks">
        {recaptchaContent.startText}
        <AnchorLink
          action={{
            model: "htmlLink",
            href: recaptchaContent.privacyPolicyUrl
          }}
          target="_blank"
          rel="noreferrer"
        >
          {recaptchaContent.privacyPloicyText}
        </AnchorLink>
        {recaptchaContent.andText}
        <AnchorLink
          action={{
            model: "htmlLink",
            href: recaptchaContent.termsOfServiceUrl
          }}
          target="_blank"
          rel="noreferrer"
        >
          {recaptchaContent.termsOfServiceText}
        </AnchorLink>
        {recaptchaContent.endText}
      </Typography>
    );
  }, [countryCode]);
};

export default RecaptchaPrivacyLinks;
