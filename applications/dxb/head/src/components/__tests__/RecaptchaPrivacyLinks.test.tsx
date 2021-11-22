import React from "react";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import RecaptchaPrivacyLinks from "../RecaptchaPrivacyLinks";

import { SiteContextProvider } from "../Site";

beforeAll(() => {
  mockConsole();
});

describe("RecaptchaPrivacyLinks component", () => {
  describe("When invalid country code is provided", () => {
    it("renders English Recaptcha policy text and urls", async () => {
      const { container, findByText, getByText } = render(
        <SiteContextProvider
          value={{
            node_locale: "en-UK",
            homePage: { title: "Home Page" },
            getMicroCopy: (path) => path,
            countryCode: "COUNTRY_CODE",
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <RecaptchaPrivacyLinks />
        </SiteContextProvider>
      );
      await findByText((content) =>
        content.startsWith(
          "This site is protected by reCAPTCHA and the Google "
        )
      );
      expect(
        (getByText("Privacy Policy").parentElement as HTMLAnchorElement).href
      ).toEqual("https://policies.google.com/privacy");

      expect(
        (getByText("Terms of Service").parentElement as HTMLAnchorElement).href
      ).toEqual("https://policies.google.com/terms");

      expect(container.firstChild).toMatchSnapshot();
    });
  });
  describe("When 'no' country code is provided", () => {
    it("renders Norwegian Recaptcha policy text and urls", async () => {
      const { container, findByText, getByText } = render(
        <SiteContextProvider
          value={{
            node_locale: "en-UK",
            homePage: { title: "Home Page" },
            getMicroCopy: (path) => path,
            countryCode: "no",
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <RecaptchaPrivacyLinks />
        </SiteContextProvider>
      );
      await findByText((content) =>
        content.startsWith(
          "Dette nettstedet er beskyttet av reCAPTCHA og Googles "
        )
      );
      expect(
        (getByText("Personvernregler").parentElement as HTMLAnchorElement).href
      ).toEqual("https://policies.google.com/privacy?hl=no-nb");

      expect(
        (getByText("Vilkår for bruk").parentElement as HTMLAnchorElement).href
      ).toEqual("https://policies.google.com/terms?hl=no-nb");

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("When 'fi' country code is provided", () => {
    it("renders Finnish Recaptcha policy text and urls", async () => {
      const { container, findByText, getByText } = render(
        <SiteContextProvider
          value={{
            node_locale: "en-UK",
            homePage: { title: "Home Page" },
            getMicroCopy: (path) => path,
            countryCode: "fi",
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <RecaptchaPrivacyLinks />
        </SiteContextProvider>
      );
      await findByText((content) =>
        content.startsWith(
          "Tätä sivustoa suojaa reCAPTCHA, ja siihen sovelletaan Googlen "
        )
      );
      expect(
        (getByText("tietosuojakäytäntöä").parentElement as HTMLAnchorElement)
          .href
      ).toEqual("https://policies.google.com/privacy?hl=fi-fi");

      expect(
        (getByText("käyttöehtoja").parentElement as HTMLAnchorElement).href
      ).toEqual("https://policies.google.com/terms?hl=fi-fi");

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("When 'it' country code is provided", () => {
    it("renders Italian Recaptcha policy text and urls", async () => {
      const { container, findByText, getByText } = render(
        <SiteContextProvider
          value={{
            node_locale: "en-UK",
            homePage: { title: "Home Page" },
            getMicroCopy: (path) => path,
            countryCode: "it",
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <RecaptchaPrivacyLinks />
        </SiteContextProvider>
      );
      await findByText((content) =>
        content.startsWith(
          "Questo sito è protetto da reCAPTCHA e si applicano le "
        )
      );
      expect(
        (getByText("Norme sulla privacy").parentElement as HTMLAnchorElement)
          .href
      ).toEqual("https://policies.google.com/privacy?hl=it-it");

      expect(
        (getByText("Termini di servizio").parentElement as HTMLAnchorElement)
          .href
      ).toEqual("https://policies.google.com/terms?hl=it-it");

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("When 'fr' country code is provided", () => {
    it("renders French Recaptcha policy text and urls", async () => {
      const { container, findByText, getByText } = render(
        <SiteContextProvider
          value={{
            node_locale: "en-UK",
            homePage: { title: "Home Page" },
            getMicroCopy: (path) => path,
            countryCode: "fr",
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <RecaptchaPrivacyLinks />
        </SiteContextProvider>
      );
      await findByText((content) =>
        content.startsWith("Ce site est protégé par reCAPTCHA et la ")
      );
      expect(
        (
          getByText("politique de confidentialité")
            .parentElement as HTMLAnchorElement
        ).href
      ).toEqual("https://policies.google.com/privacy?hl=fr-fr");

      expect(
        (
          getByText("conditions d'utilisation")
            .parentElement as HTMLAnchorElement
        ).href
      ).toEqual("https://policies.google.com/terms?hl=fr-fr");

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("When 'de' country code is provided", () => {
    it("renders German Recaptcha policy text and urls", async () => {
      const { container, findByText, getByText } = render(
        <SiteContextProvider
          value={{
            node_locale: "en-UK",
            homePage: { title: "Home Page" },
            getMicroCopy: (path) => path,
            countryCode: "de",
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <RecaptchaPrivacyLinks />
        </SiteContextProvider>
      );
      await findByText((content) =>
        content.startsWith(
          "Diese Website ist durch reCAPTCHA geschützt und es gelten die "
        )
      );

      expect(
        (
          getByText("Datenschutzbestimmungen")
            .parentElement as HTMLAnchorElement
        ).href
      ).toEqual("https://policies.google.com/privacy?hl=de-de");

      expect(
        (getByText("Nutzungsbedingungen").parentElement as HTMLAnchorElement)
          .href
      ).toEqual("https://policies.google.com/terms?hl=de-de");

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("When custom styles added", () => {
    it("renders with custom style", async () => {
      const { container, findByText, getByText } = render(
        <SiteContextProvider
          value={{
            node_locale: "en-UK",
            homePage: { title: "Home Page" },
            getMicroCopy: (path) => path,
            countryCode: "de",
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <RecaptchaPrivacyLinks customStyle="customStyle" />
        </SiteContextProvider>
      );
      await findByText((content) =>
        content.startsWith(
          "Diese Website ist durch reCAPTCHA geschützt und es gelten die "
        )
      );

      expect(
        (
          getByText("Datenschutzbestimmungen")
            .parentElement as HTMLAnchorElement
        ).href
      ).toEqual("https://policies.google.com/privacy?hl=de-de");

      expect(
        (getByText("Nutzungsbedingungen").parentElement as HTMLAnchorElement)
          .href
      ).toEqual("https://policies.google.com/terms?hl=de-de");

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
