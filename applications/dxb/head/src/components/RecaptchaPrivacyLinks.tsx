import AnchorLink from "@bmi-digital/components/anchor-link";
import Typography from "@bmi-digital/components/typography";
import React, { useMemo } from "react";
import getRecaptchaPrivacyContent, {
  RecaptchaPolicyContentType
} from "./RecaptchaContentProvider";
import { useSiteContext } from "./Site";

type Props = {
  className?: string;
  testId?: string;
};

const RecaptchaPrivacyLinks = (props: Props) => {
  const { countryCode } = useSiteContext();
  const { className, testId } = props;
  const availableTestId = testId ? { "data-testid": testId } : {};
  return useMemo(() => {
    const recaptchaContent: RecaptchaPolicyContentType =
      getRecaptchaPrivacyContent(countryCode);
    return (
      <Typography
        className={className ? className : "RecaptchaPrivacyLinks"}
        {...availableTestId}
      >
        {recaptchaContent.startText}
        <AnchorLink
          action={{
            model: "htmlLink",
            href: recaptchaContent.privacyPolicyUrl
          }}
          target="_blank"
          rel="noreferrer noopener"
          data-testid={"recaptcha-privacy-policy-link"}
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
          rel="noreferrer noopener"
          data-testid={"recaptcha-terms-of-service-link"}
        >
          {recaptchaContent.termsOfServiceText}
        </AnchorLink>
        {recaptchaContent.endText}
      </Typography>
    );
  }, [countryCode, className]);
};

export default RecaptchaPrivacyLinks;
