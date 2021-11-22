import React, { useMemo } from "react";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
import getRecaptchaPrivacyContent, {
  RecaptchaPolicyContentType
} from "./RecaptchaContentProvider";
import { useSiteContext } from "./Site";

import styles from "./styles/RecaptchaPrivacyLinks.module.scss";

type Props = {
  customStyle?: string;
};

const RecaptchaPrivacyLinks = (props: Props) => {
  const { countryCode } = useSiteContext();
  const { customStyle } = props;

  return useMemo(() => {
    const recaptchaContent: RecaptchaPolicyContentType =
      getRecaptchaPrivacyContent(countryCode);
    return (
      <Typography
        className={
          customStyle ? styles[`${customStyle}`] : "RecaptchaPrivacyLinks"
        }
      >
        {recaptchaContent.startText}
        <AnchorLink
          action={{
            model: "htmlLink",
            href: recaptchaContent.privacyPolicyUrl
          }}
          target="_blank"
          rel="noreferrer noopener"
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
        >
          {recaptchaContent.termsOfServiceText}
        </AnchorLink>
        {recaptchaContent.endText}
      </Typography>
    );
  }, [countryCode]);
};

export default RecaptchaPrivacyLinks;
