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

const recaptchaContent_TR: RecaptchaPolicyContentType = {
  startText: "Bu site reCAPTCHA tarafından korunmaktadır ve Google ",
  privacyPloicyText: "Gizlilik Politikası",
  andText: " ve ",
  termsOfServiceText: "Hizmet Şartları",
  endText: " geçerlidir.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=tr",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=tr"
};

const recaptchaContent_ES: RecaptchaPolicyContentType = {
  startText: "Este sitio web está protegido por reCAPTCHA y Google ",
  privacyPloicyText: "Política de privacidad",
  andText: " y ",
  termsOfServiceText: "Términos de servicio",
  endText: " aplicar.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=es",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=es"
};

const recaptchaContent_PT: RecaptchaPolicyContentType = {
  startText: "Este site é protegido pelo reCAPTCHA e a ",
  privacyPloicyText: "Política de Privacidade",
  andText: " e os ",
  termsOfServiceText: "Termos de Serviço",
  endText: " do Google se aplicam.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=pt",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=pt"
};

const recaptchaContent_BE_NL: RecaptchaPolicyContentType = {
  startText: "Deze site wordt beschermd door reCAPTCHA en Google ",
  privacyPloicyText: "Privacybeleid",
  andText: " en ",
  termsOfServiceText: "Servicevoorwaarden",
  endText: " zijn van toepassing.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=nl",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=nl"
};

const recaptchaContent_RO: RecaptchaPolicyContentType = {
  startText: "Acest site este protejat de reCAPTCHA și se aplică ",
  privacyPloicyText: "Politica de confidențialitate",
  andText: " și ",
  termsOfServiceText: "Termenii și condițiile",
  endText: " Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=ro",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=ro"
};

const recaptchaContent_ID: RecaptchaPolicyContentType = {
  startText: "Situs ini dilindungi oleh reCAPTCHA dan berlaku ",
  privacyPloicyText: "Kebijakan Privasi",
  andText: " dan ",
  termsOfServiceText: "Persyaratan Layanan",
  endText: " Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=id",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=id"
};

const recaptchaContent_PL: RecaptchaPolicyContentType = {
  startText: "Ta witryna jest chroniona przez reCAPTCHA i obowiązuje ",
  privacyPloicyText: "Polityka prywatności",
  andText: " i ",
  termsOfServiceText: "Warunki korzystania z usługi",
  endText: " Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=pl",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=pl"
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
RecaptchaPrivacyContentMap["tr"] = recaptchaContent_TR;
RecaptchaPrivacyContentMap["es"] = recaptchaContent_ES;
RecaptchaPrivacyContentMap["pt"] = recaptchaContent_PT;
RecaptchaPrivacyContentMap["be"] = recaptchaContent_BE_NL;
RecaptchaPrivacyContentMap["ro"] = recaptchaContent_RO;
RecaptchaPrivacyContentMap["id"] = recaptchaContent_ID;
RecaptchaPrivacyContentMap["pl"] = recaptchaContent_PL;

const getRecaptchaPrivacyContent = (
  countryCode: string
): RecaptchaPolicyContentType => {
  // eslint-disable-next-line security/detect-object-injection
  const captchaContent = RecaptchaPrivacyContentMap[countryCode];
  return captchaContent || defaultContent;
};

export default getRecaptchaPrivacyContent;
