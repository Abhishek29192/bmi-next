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
  startText: "Este sitio está protegido por reCAPTCHA y se aplican la ",
  privacyPloicyText: "Política de privacidad",
  andText: " y los",
  termsOfServiceText: "Términos",
  endText: " y condiciones de Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=es",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=es"
};

const recaptchaContent_PT: RecaptchaPolicyContentType = {
  startText: "Este site está protegido por reCAPTCHA e aplicada a ",
  privacyPloicyText: "Política de Privacidade",
  andText: " e os ",
  termsOfServiceText: "Termos",
  endText: " e condições de Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=pt",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=pt"
};

const recaptchaContent_NL_BE: RecaptchaPolicyContentType = {
  startText: "Deze site wordt beschermd door reCAPTCHA en Google ",
  privacyPloicyText: "Privacybeleid",
  andText: " en ",
  termsOfServiceText: "Servicevoorwaarden",
  endText: " zijn van toepassing.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=nl",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=nl"
};

const recaptchaContent_FR_BE: RecaptchaPolicyContentType = {
  startText: "Ce site est protégé par reCAPTCHA et la ",
  privacyPloicyText: "politique de confidentialité",
  andText: " et les ",
  termsOfServiceText: "conditions d'utilisation",
  endText: "de Google s'appliquent.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=fr-be",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=fr-be"
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

const recaptchaContent_CH_DE: RecaptchaPolicyContentType = {
  startText: "Diese Website ist durch reCAPTCHA geschützt und es gelten die ",
  privacyPloicyText: "Datenschutzbestimmungen",
  andText: " und ",
  termsOfServiceText: "Nutzungsbedingungen",
  endText: " von Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=de-ch ",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=de-ch"
};

const recaptchaContent_FR_CH: RecaptchaPolicyContentType = {
  startText: "Ce site est protégé par reCAPTCHA et la ",
  privacyPloicyText: "politique de confidentialité",
  andText: " et les ",
  termsOfServiceText: "conditions d'utilisation",
  endText: "de Google s'appliquent.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=fr-ch",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=fr-ch"
};

const recaptchaContent_CN_ZH: RecaptchaPolicyContentType = {
  startText: "本网站受 reCAPTCHA 保护，适用 Google ",
  privacyPloicyText: "隐私政策",
  andText: " 和 ",
  termsOfServiceText: "服务条款",
  endText: " 。",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=zh-cn",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=zh-cn"
};

const recaptchaContent_HU: RecaptchaPolicyContentType = {
  startText: "Ezt a webhelyet a reCAPTCHA védi, és a Google ",
  privacyPloicyText: "adatvédelmi irányelvei",
  andText: " valamint ",
  termsOfServiceText: "szolgáltatási feltételei",
  endText: " vonatkoznak rá.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=hu",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=hu"
};

const recaptchaContent_CZ: RecaptchaPolicyContentType = {
  startText: "Tato stránka je chráněna nástrojem reCAPTCHA a platí ",
  privacyPloicyText: "zásady ochrany osobních údajů",
  andText: " a ",
  termsOfServiceText: "smluvní podmínky",
  endText: " společnosti Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=cs",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=cs"
};

const recaptchaContent_SK: RecaptchaPolicyContentType = {
  startText: "Táto stránka je chránená nástrojom reCAPTCHA a platia pre ňu ",
  privacyPloicyText: "Zásady ochrany osobných údajov",
  andText: " a ",
  termsOfServiceText: "zmluvné podmienky",
  endText: " spoločnosti Google.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=sk",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=sk"
};

const recaptchaContent_DK: RecaptchaPolicyContentType = {
  startText: "Denne hjemmeside er beskyttet af reCAPTCHA, og Googles ",
  privacyPloicyText: "privatlivspolitik",
  andText: " og ",
  termsOfServiceText: "vilkår for brug",
  endText: " gælder.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=da",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=da"
};

const recaptchaContent_SE: RecaptchaPolicyContentType = {
  startText: "Den här webbplatsen är skyddad av reCAPTCHA och Google ",
  privacyPloicyText: "Integritetspolicy",
  andText: " och ",
  termsOfServiceText: "Användarvillkor",
  endText: " tillämpa.",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=sv",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=sv"
};

const recaptchaContent_EE: RecaptchaPolicyContentType = {
  startText: "See leht on kaitstud Google reCAPTCHA-ga. Rakenduvad Google ",
  privacyPloicyText: "privaatsuspõhimõtted",
  andText: " ja ",
  termsOfServiceText: "kasutustingimused",
  endText: ".",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=et",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=et"
};

const recaptchaContent_LT: RecaptchaPolicyContentType = {
  startText: "Ši svetainė yra apsaugota reCAPTCHA ir taikoma “Google” ",
  privacyPloicyText: "privatumo politika",
  andText: " ir ",
  termsOfServiceText: "paslaugų tiekimo sąlygos",
  endText: ".",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=lt",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=lt"
};

const recaptchaContent_LV: RecaptchaPolicyContentType = {
  startText: "Šo vietni aizsargā reCAPTCHA kā arī spēkā ir Google ",
  privacyPloicyText: "privātuma politika",
  andText: " un ",
  termsOfServiceText: "vietnes lietošanas noteikumi",
  endText: ".",
  privacyPolicyUrl: "https://policies.google.com/privacy?hl=lv",
  termsOfServiceUrl: "https://policies.google.com/terms?hl=lv"
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
RecaptchaPrivacyContentMap["be"] = recaptchaContent_NL_BE;
RecaptchaPrivacyContentMap["fr-be"] = recaptchaContent_FR_BE;
RecaptchaPrivacyContentMap["ro"] = recaptchaContent_RO;
RecaptchaPrivacyContentMap["id"] = recaptchaContent_ID;
RecaptchaPrivacyContentMap["pl"] = recaptchaContent_PL;
RecaptchaPrivacyContentMap["ch"] = recaptchaContent_CH_DE;
RecaptchaPrivacyContentMap["fr-ch"] = recaptchaContent_FR_CH;
RecaptchaPrivacyContentMap["cn"] = recaptchaContent_CN_ZH;
RecaptchaPrivacyContentMap["hu"] = recaptchaContent_HU;
RecaptchaPrivacyContentMap["cz"] = recaptchaContent_CZ;
RecaptchaPrivacyContentMap["sk"] = recaptchaContent_SK;
RecaptchaPrivacyContentMap["dk"] = recaptchaContent_DK;
RecaptchaPrivacyContentMap["se"] = recaptchaContent_SE;
RecaptchaPrivacyContentMap["ee"] = recaptchaContent_EE;
RecaptchaPrivacyContentMap["lt"] = recaptchaContent_LT;
RecaptchaPrivacyContentMap["lv"] = recaptchaContent_LV;

const getRecaptchaPrivacyContent = (
  countryCode: string
): RecaptchaPolicyContentType => {
  // eslint-disable-next-line security/detect-object-injection
  const captchaContent = RecaptchaPrivacyContentMap[countryCode];
  return captchaContent || defaultContent;
};

export default getRecaptchaPrivacyContent;
