export type RecaptchaPolicyContentType = {
  startText: string;
  privacyPloicyText: string;
  privacyPolicyUrl: string;
  andText: string;
  termsOfServiceText: string;
  termsOfServiceUrl: string;
  endText: string;
};

const defaultContent: RecaptchaPolicyContentType = {
  startText: "This site is protected by reCAPTCHA and the Google ",
  privacyPloicyText: "Privacy Policy",
  andText: " and ",
  termsOfServiceText: "Terms of Service",
  endText: " apply.",
  privacyPolicyUrl: "https://policies.google.com/privacy",
  termsOfServiceUrl: "https://policies.google.com/terms"
};

const recaptchaContent_NL: RecaptchaPolicyContentType = {
  startText: "Deze site wordt beschermd door reCAPTCHA en Google ",
  privacyPloicyText: "Privacybeleid",
  andText: " en ",
  termsOfServiceText: "Servicevoorwaarden",
  endText: " zijn van toepassing.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=nl",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=nl"
};

const recaptchaContent_NO: RecaptchaPolicyContentType = {
  startText: "Dette nettstedet er beskyttet av reCAPTCHA og Googles ",
  privacyPloicyText: "Personvernregler",
  andText: " og ",
  termsOfServiceText: "Vilkår for bruk",
  endText: " gjelder.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=no-nb",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=no-nb"
};

const recaptchaContent_FI: RecaptchaPolicyContentType = {
  startText: "Tätä sivustoa suojaa reCAPTCHA, ja siihen sovelletaan Googlen ",
  privacyPloicyText: "tietosuojakäytäntöä",
  andText: " ja ",
  termsOfServiceText: "käyttöehtoja",
  endText: ".",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=fi-fi",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=fi-fi"
};

const recaptchaContent_IT: RecaptchaPolicyContentType = {
  startText: "Questo sito è protetto da reCAPTCHA e si applicano le ",
  privacyPloicyText: "Norme sulla privacy",
  andText: " e i ",
  termsOfServiceText: "Termini di servizio",
  endText: " di Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=it-it",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=it-it"
};

const recaptchaContent_FR: RecaptchaPolicyContentType = {
  startText: "Ce site est protégé par reCAPTCHA et la ",
  privacyPloicyText: "politique de confidentialité",
  andText: " et les ",
  termsOfServiceText: "conditions d'utilisation",
  endText: " de Google s'appliquent.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=fr-fr",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=fr-fr"
};

const recaptchaContent_DE: RecaptchaPolicyContentType = {
  startText: "Diese Website ist durch reCAPTCHA geschützt und es gelten die ",
  privacyPloicyText: "Datenschutzbestimmungen",
  andText: " und ",
  termsOfServiceText: "Nutzungsbedingungen",
  endText: " von Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=de-de",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=de-de"
};

const recaptchaContent_AT: RecaptchaPolicyContentType = {
  startText: "Diese Website ist durch reCAPTCHA geschützt und es gelten die ",
  privacyPloicyText: "Datenschutzbestimmungen",
  andText: " und ",
  termsOfServiceText: "Nutzungsbedingungen",
  endText: " von Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=de-at",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=de-at"
};

const RecaptchaPrivacyContentMap: Map<string, RecaptchaPolicyContentType> =
  new Map<string, RecaptchaPolicyContentType>();
RecaptchaPrivacyContentMap["no"] = recaptchaContent_NO;
RecaptchaPrivacyContentMap["fi"] = recaptchaContent_FI;
RecaptchaPrivacyContentMap["it"] = recaptchaContent_IT;
RecaptchaPrivacyContentMap["fr"] = recaptchaContent_FR;
RecaptchaPrivacyContentMap["de"] = recaptchaContent_DE;
RecaptchaPrivacyContentMap["at"] = recaptchaContent_AT;
RecaptchaPrivacyContentMap["nl"] = recaptchaContent_NL;

const getRecaptchaPrivacyContent = (
  countryCode: string
): RecaptchaPolicyContentType => {
  // eslint-disable-next-line security/detect-object-injection
  const captchaContent = RecaptchaPrivacyContentMap[countryCode];
  return captchaContent || defaultContent;
};

export default getRecaptchaPrivacyContent;
