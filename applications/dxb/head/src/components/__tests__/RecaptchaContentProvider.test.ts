import getRecaptchaPrivacyContent from "../RecaptchaContentProvider";

describe("getRecaptchaPrivacyContent tests", () => {
  describe("When invalid country code is passed", () => {
    test("returns default english recaptcha content", () => {
      const result = getRecaptchaPrivacyContent("COUNTRY_CODE");
      expect(result.startText).toEqual(
        "This site is protected by reCAPTCHA and the Google "
      );
      expect(result.privacyPloicyText).toEqual("Privacy Policy");
      expect(result.andText).toEqual(" and ");
      expect(result.termsOfServiceText).toEqual("Terms of Service");
      expect(result.endText).toEqual(" apply.");
      expect(result.privacyPolicyUrl).toEqual(
        "https://policies.google.com/privacy"
      );
      expect(result.termsOfServiceUrl).toEqual(
        "https://policies.google.com/terms"
      );
    });
  });

  describe("When country code 'no' is passed", () => {
    test("returns Norway recaptcha content", () => {
      const result = getRecaptchaPrivacyContent("no");
      expect(result.startText).toEqual(
        "Dette nettstedet er beskyttet av reCAPTCHA og Googles "
      );
      expect(result.privacyPloicyText).toEqual("Personvernregler");
      expect(result.andText).toEqual(" og ");
      expect(result.termsOfServiceText).toEqual("Vilkår for bruk");
      expect(result.endText).toEqual(" gjelder.");
      expect(result.privacyPolicyUrl).toEqual(
        "https://policies.google.com/privacy?hl=no-nb"
      );
      expect(result.termsOfServiceUrl).toEqual(
        "https://policies.google.com/terms?hl=no-nb"
      );
    });
  });

  describe("When country code 'nl' is passed", () => {
    test("returns Netherlands recaptcha content", () => {
      const result = getRecaptchaPrivacyContent("nl");
      expect(result.startText).toEqual(
        "Deze site wordt beschermd door reCAPTCHA en Google "
      );
      expect(result.privacyPloicyText).toEqual("Privacybeleid");
      expect(result.andText).toEqual(" en ");
      expect(result.termsOfServiceText).toEqual("Servicevoorwaarden");
      expect(result.endText).toEqual(" zijn van toepassing.");
      expect(result.privacyPolicyUrl).toEqual(
        "https://policies.google.com/privacy?hl=nl"
      );
      expect(result.termsOfServiceUrl).toEqual(
        "https://policies.google.com/terms?hl=nl"
      );
    });
  });

  describe("When country code 'fi' is passed", () => {
    test("returns Finnish recaptcha content", () => {
      const result = getRecaptchaPrivacyContent("fi");
      expect(result.startText).toEqual(
        "Tätä sivustoa suojaa reCAPTCHA, ja siihen sovelletaan Googlen "
      );
      expect(result.privacyPloicyText).toEqual("tietosuojakäytäntöä");
      expect(result.andText).toEqual(" ja ");
      expect(result.termsOfServiceText).toEqual("käyttöehtoja");
      expect(result.endText).toEqual(".");
      expect(result.privacyPolicyUrl).toEqual(
        "https://policies.google.com/privacy?hl=fi-fi"
      );
      expect(result.termsOfServiceUrl).toEqual(
        "https://policies.google.com/terms?hl=fi-fi"
      );
    });
  });

  describe("When country code 'it' is passed", () => {
    test("returns Italian recaptcha content", () => {
      const result = getRecaptchaPrivacyContent("it");
      expect(result.startText).toEqual(
        "Questo sito è protetto da reCAPTCHA e si applicano le "
      );
      expect(result.privacyPloicyText).toEqual("Norme sulla privacy");
      expect(result.andText).toEqual(" e i ");
      expect(result.termsOfServiceText).toEqual("Termini di servizio");
      expect(result.endText).toEqual(" di Google.");
      expect(result.privacyPolicyUrl).toEqual(
        "https://policies.google.com/privacy?hl=it-it"
      );
      expect(result.termsOfServiceUrl).toEqual(
        "https://policies.google.com/terms?hl=it-it"
      );
    });
  });

  describe("When country code 'fr' is passed", () => {
    test("returns French recaptcha content", () => {
      const result = getRecaptchaPrivacyContent("fr");
      expect(result.startText).toEqual(
        "Ce site est protégé par reCAPTCHA et la "
      );
      expect(result.privacyPloicyText).toEqual("politique de confidentialité");
      expect(result.andText).toEqual(" et les ");
      expect(result.termsOfServiceText).toEqual("conditions d'utilisation");
      expect(result.endText).toEqual(" de Google s'appliquent.");
      expect(result.privacyPolicyUrl).toEqual(
        "https://policies.google.com/privacy?hl=fr-fr"
      );
      expect(result.termsOfServiceUrl).toEqual(
        "https://policies.google.com/terms?hl=fr-fr"
      );
    });
  });

  describe("When country code 'de' is passed", () => {
    test("returns German recaptcha content", () => {
      const result = getRecaptchaPrivacyContent("de");
      expect(result.startText).toEqual(
        "Diese Website ist durch reCAPTCHA geschützt und es gelten die "
      );
      expect(result.privacyPloicyText).toEqual("Datenschutzbestimmungen");
      expect(result.andText).toEqual(" und ");
      expect(result.termsOfServiceText).toEqual("Nutzungsbedingungen");
      expect(result.endText).toEqual(" von Google.");
      expect(result.privacyPolicyUrl).toEqual(
        "https://policies.google.com/privacy?hl=de-de"
      );
      expect(result.termsOfServiceUrl).toEqual(
        "https://policies.google.com/terms?hl=de-de"
      );
    });
  });

  describe("When country code 'tr' is passed", () => {
    test("returns Turkey recaptcha content", () => {
      const result = getRecaptchaPrivacyContent("tr");
      expect(result.startText).toEqual(
        "Bu site reCAPTCHA tarafından korunmaktadır ve Google "
      );
      expect(result.privacyPloicyText).toEqual("Gizlilik Politikası");
      expect(result.andText).toEqual(" ve ");
      expect(result.termsOfServiceText).toEqual("Hizmet Şartları");
      expect(result.endText).toEqual(" geçerlidir.");
      expect(result.privacyPolicyUrl).toEqual(
        "https://policies.google.com/privacy?hl=tr"
      );
      expect(result.termsOfServiceUrl).toEqual(
        "https://policies.google.com/terms?hl=tr"
      );
    });
  });
});
