import { ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";
import React from "react";
import RecaptchaPrivacyLinks from "../RecaptchaPrivacyLinks";
import { SiteContextProvider } from "../Site";
import { getMockSiteContext } from "./utils/SiteContextProvider";

describe("RecaptchaPrivacyLinks component", () => {
  describe("When invalid country code is provided", () => {
    it("renders English Recaptcha policy text and urls", async () => {
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider
            value={{
              ...getMockSiteContext("COUNTRY_CODE", "en-UK"),
              homePage: { title: "Home Page" },
              getMicroCopy: (path) => path,
              reCaptchaKey: "1234",
              reCaptchaNet: false
            }}
          >
            <RecaptchaPrivacyLinks />
          </SiteContextProvider>
        </ThemeProvider>
      );
      await screen.findByText((content) =>
        content.startsWith(
          "This site is protected by reCAPTCHA and the Google "
        )
      );
      expect(
        screen.getByTestId("recaptcha-privacy-policy-link")
      ).toHaveAttribute("href", "https://policies.google.com/privacy");

      expect(
        screen.getByTestId("recaptcha-terms-of-service-link")
      ).toHaveAttribute("href", "https://policies.google.com/terms");

      expect(container).toMatchSnapshot();
    });
  });
  describe("When 'no' country code is provided", () => {
    it("renders Norwegian Recaptcha policy text and urls", async () => {
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider
            value={{
              ...getMockSiteContext("no", "en-UK"),
              homePage: { title: "Home Page" },
              getMicroCopy: (path) => path,
              reCaptchaKey: "1234",
              reCaptchaNet: false
            }}
          >
            <RecaptchaPrivacyLinks />
          </SiteContextProvider>
        </ThemeProvider>
      );
      await screen.findByText((content) =>
        content.startsWith(
          "Dette nettstedet er beskyttet av reCAPTCHA og Googles "
        )
      );
      expect(
        screen.getByTestId("recaptcha-privacy-policy-link")
      ).toHaveAttribute("href", "https://policies.google.com/privacy?hl=no-nb");

      expect(
        screen.getByTestId("recaptcha-terms-of-service-link")
      ).toHaveAttribute("href", "https://policies.google.com/terms?hl=no-nb");

      expect(container).toMatchSnapshot();
    });
  });

  describe("When 'fi' country code is provided", () => {
    it("renders Finnish Recaptcha policy text and urls", async () => {
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider
            value={{
              ...getMockSiteContext("fi", "en-UK"),
              homePage: { title: "Home Page" },
              getMicroCopy: (path) => path,
              reCaptchaKey: "1234",
              reCaptchaNet: false
            }}
          >
            <RecaptchaPrivacyLinks />
          </SiteContextProvider>
        </ThemeProvider>
      );
      await screen.findByText((content) =>
        content.startsWith(
          "Tätä sivustoa suojaa reCAPTCHA, ja siihen sovelletaan Googlen "
        )
      );
      expect(
        screen.getByTestId("recaptcha-privacy-policy-link")
      ).toHaveAttribute("href", "https://policies.google.com/privacy?hl=fi-fi");

      expect(
        screen.getByTestId("recaptcha-terms-of-service-link")
      ).toHaveAttribute("href", "https://policies.google.com/terms?hl=fi-fi");

      expect(container).toMatchSnapshot();
    });
  });

  describe("When 'it' country code is provided", () => {
    it("renders Italian Recaptcha policy text and urls", async () => {
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider
            value={{
              ...getMockSiteContext("it", "en-UK"),
              homePage: { title: "Home Page" },
              getMicroCopy: (path) => path,
              reCaptchaKey: "1234",
              reCaptchaNet: false
            }}
          >
            <RecaptchaPrivacyLinks />
          </SiteContextProvider>
        </ThemeProvider>
      );
      await screen.findByText((content) =>
        content.startsWith(
          "Questo sito è protetto da reCAPTCHA e si applicano le "
        )
      );
      expect(
        screen.getByTestId("recaptcha-privacy-policy-link")
      ).toHaveAttribute("href", "https://policies.google.com/privacy?hl=it-it");

      expect(
        screen.getByTestId("recaptcha-terms-of-service-link")
      ).toHaveAttribute("href", "https://policies.google.com/terms?hl=it-it");

      expect(container).toMatchSnapshot();
    });
  });

  describe("When 'fr' country code is provided", () => {
    it("renders French Recaptcha policy text and urls", async () => {
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider
            value={{
              ...getMockSiteContext("fr", "en-UK"),
              homePage: { title: "Home Page" },
              getMicroCopy: (path) => path,
              reCaptchaKey: "1234",
              reCaptchaNet: false
            }}
          >
            <RecaptchaPrivacyLinks />
          </SiteContextProvider>
        </ThemeProvider>
      );
      await screen.findByText((content) =>
        content.startsWith("Ce site est protégé par reCAPTCHA et la ")
      );
      expect(
        screen.getByTestId("recaptcha-privacy-policy-link")
      ).toHaveAttribute("href", "https://policies.google.com/privacy?hl=fr-fr");

      expect(
        screen.getByTestId("recaptcha-terms-of-service-link")
      ).toHaveAttribute("href", "https://policies.google.com/terms?hl=fr-fr");

      expect(container).toMatchSnapshot();
    });
  });

  describe("When 'de' country code is provided", () => {
    it("renders German Recaptcha policy text and urls", async () => {
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider
            value={{
              ...getMockSiteContext("de", "en-UK"),
              homePage: { title: "Home Page" },
              getMicroCopy: (path) => path,
              reCaptchaKey: "1234",
              reCaptchaNet: false
            }}
          >
            <RecaptchaPrivacyLinks />
          </SiteContextProvider>
        </ThemeProvider>
      );
      await screen.findByText((content) =>
        content.startsWith(
          "Diese Website ist durch reCAPTCHA geschützt und es gelten die "
        )
      );

      expect(
        screen.getByTestId("recaptcha-privacy-policy-link")
      ).toHaveAttribute("href", "https://policies.google.com/privacy?hl=de-de");

      expect(
        screen.getByTestId("recaptcha-terms-of-service-link")
      ).toHaveAttribute("href", "https://policies.google.com/terms?hl=de-de");

      expect(container).toMatchSnapshot();
    });
  });

  describe("When 'at' country code is provided", () => {
    it("renders German Recaptcha policy text and urls", async () => {
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider
            value={{
              ...getMockSiteContext("at", "en-UK"),
              homePage: { title: "Home Page" },
              getMicroCopy: (path) => path,
              reCaptchaKey: "1234",
              reCaptchaNet: false
            }}
          >
            <RecaptchaPrivacyLinks />
          </SiteContextProvider>
        </ThemeProvider>
      );
      await screen.findByText((content) =>
        content.startsWith(
          "Diese Website ist durch reCAPTCHA geschützt und es gelten die "
        )
      );

      expect(
        screen.getByTestId("recaptcha-privacy-policy-link")
      ).toHaveAttribute("href", "https://policies.google.com/privacy?hl=de-at");

      expect(
        screen.getByTestId("recaptcha-terms-of-service-link")
      ).toHaveAttribute("href", "https://policies.google.com/terms?hl=de-at");

      expect(container).toMatchSnapshot();
    });
  });

  describe("When custom styles added", () => {
    it("renders with custom style", async () => {
      const { container } = render(
        <ThemeProvider>
          <SiteContextProvider
            value={{
              ...getMockSiteContext("de", "en-UK"),
              homePage: { title: "Home Page" },
              getMicroCopy: (path) => path,
              countryCode: "de",
              reCaptchaKey: "1234",
              reCaptchaNet: false
            }}
          >
            <RecaptchaPrivacyLinks className="customStyle" />
          </SiteContextProvider>
        </ThemeProvider>
      );
      await screen.findByText((content) =>
        content.startsWith(
          "Diese Website ist durch reCAPTCHA geschützt und es gelten die "
        )
      );

      expect(
        screen.getByTestId("recaptcha-privacy-policy-link")
      ).toHaveAttribute("href", "https://policies.google.com/privacy?hl=de-de");

      expect(
        screen.getByTestId("recaptcha-terms-of-service-link")
      ).toHaveAttribute("href", "https://policies.google.com/terms?hl=de-de");

      expect(container).toMatchSnapshot();
    });
  });
});
