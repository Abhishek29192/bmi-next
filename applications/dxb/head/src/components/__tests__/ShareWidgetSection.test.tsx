import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import ShareWidgetSection from "../ShareWidgetSection";
import createShareWidgetData from "../../__tests__/helpers/ShareWidgetHelper";

const user = userEvent.setup({
  delay: null
});

describe("Share Widget Section", () => {
  describe("Section", () => {
    it("should render the section background in white", () => {
      renderWithProviders(
        <ShareWidgetSection data={createShareWidgetData()} />
      );

      const section = screen.getByTestId("share-widget-section");
      expect(section).toHaveClass("Section-white");
    });

    it("should render the section with no spacing", () => {
      renderWithProviders(
        <ShareWidgetSection data={createShareWidgetData()} />
      );

      const section = screen.getByTestId("share-widget-section");
      expect(section).toHaveClass("Section-noSpacing");
    });
  });

  describe("Copy Button", () => {
    it("should render the clipboardSuccessMessage prop text as the copy to clipboard tooltip text, if defined", async () => {
      global.navigator.clipboard.writeText = jest.fn();

      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            clipboardSuccessMessage: "example-clipboard-success-message",
            copy: true
          })}
        />
      );

      const copyToClipboardButton = screen.getByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );

      await user.click(copyToClipboardButton);

      expect(await screen.findByRole("tooltip")).toHaveTextContent(
        "example-clipboard-success-message"
      );
    });

    it("should render the clipboard success micro copy text as the copy to clipboard tooltip text, if the clipboardSuccessMessage prop is null", async () => {
      global.navigator.clipboard.writeText = jest.fn();

      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            clipboardSuccessMessage: null,
            copy: true
          })}
        />
      );

      const copyToClipboardButton = screen.getByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );

      await user.click(copyToClipboardButton);

      expect(await screen.findByRole("tooltip")).toHaveTextContent(
        "MC: share.clipboardSuccess"
      );
    });

    it("should render the clipboardErrorMessage prop text as the copy to clipboard tooltip text, if defined", async () => {
      global.navigator.clipboard.writeText = jest.fn(() => Promise.reject());

      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            clipboardErrorMessage: "example-clipboard-error-message",
            copy: true
          })}
        />
      );

      const copyToClipboardButton = screen.getByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );

      await user.click(copyToClipboardButton);

      expect(await screen.findByRole("tooltip")).toHaveTextContent(
        "example-clipboard-error-message"
      );
    });

    it("should render the clipboard error message micro copy text as the copy to clipboard tooltip text, if the clipboardErrorMessage prop is null", async () => {
      global.navigator.clipboard.writeText = jest.fn(() => Promise.reject());

      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            clipboardErrorMessage: null,
            copy: true
          })}
        />
      );

      const copyToClipboardButton = screen.getByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );

      await user.click(copyToClipboardButton);

      expect(await screen.findByRole("tooltip")).toHaveTextContent(
        "MC: share.clipboardFailure"
      );
    });

    it("should render the copy button if the copy prop is true, with the share microCopy text as the aria-label", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            copy: true
          })}
        />
      );
      const copyButton = screen.getByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );
      expect(copyButton).toBeInTheDocument();
      expect(copyButton).toHaveAttribute("aria-label", "MC: share.copy");
    });

    it("should render the tooltip label and aria-label with the share microCopy text, if copy is true, when the user hovers over the copy button", async () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            copy: true
          })}
        />
      );
      const copyButton = screen.getByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );

      fireEvent.mouseOver(copyButton);
      const toolTip = await screen.findByRole("tooltip");

      expect(toolTip).toHaveTextContent("MC: share.copy");
    });

    it("should apply the following data-gtm attribute to the copy button if the copy prop is true", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            copy: true
          })}
        />
      );
      const copyButton = screen.getByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );

      expect(copyButton).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-share1","label":"MC: share.copy","action":"copy"}'
      );
    });

    it("should not render the copy button if the copy prop is false", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            copy: false
          })}
        />
      );
      const copyButton = screen.queryByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );
      expect(copyButton).not.toBeInTheDocument();
    });

    it("should not render the copy button if the copy prop is null", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            copy: null
          })}
        />
      );
      const copyButton = screen.queryByTestId(
        "copy-to-clipboard-button-MC:-share.copy"
      );
      expect(copyButton).not.toBeInTheDocument();
    });
  });

  describe("Email Button", () => {
    it("should render the email button if the email prop is true, with the share microCopy text as the aria-label", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            email: true
          })}
        />
      );

      const emailButton = screen.getByTestId("icon-button");
      const emailSVG = screen.getByTestId("share-widget-icon-email");

      expect(emailButton).toBeInTheDocument();
      expect(emailButton).toHaveAttribute("aria-label", "MC: share.email");
      expect(emailButton).toHaveAttribute("data-channel", "email");
      expect(emailSVG).toBeInTheDocument();
    });

    it("should apply the following data-gtm attribute to the email button if the email prop is true", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            email: true
          })}
        />
      );

      const emailButton = screen.getByTestId("icon-button");

      expect(emailButton).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-share1","label":"MC: share.email","action":"email"}'
      );
    });

    it("should not render the email button if the email prop is false", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            email: false
          })}
        />
      );

      const emailButton = screen.queryByTestId("icon-button");
      expect(emailButton).not.toBeInTheDocument();
    });

    it("should not render the email button if the email prop is null", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            email: null
          })}
        />
      );

      const emailButton = screen.queryByTestId("icon-button");
      expect(emailButton).not.toBeInTheDocument();
    });
  });

  describe("Linkedin Button", () => {
    it("should render the linkedin button if the linkedin prop is true, with the share microCopy text as the aria-label", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            linkedin: true
          })}
        />
      );

      const linkedinButton = screen.getByTestId("icon-button");
      const linkedinSVG = screen.getByTestId("share-widget-icon-linkedin");

      expect(linkedinButton).toBeInTheDocument();
      expect(linkedinButton).toHaveAttribute(
        "aria-label",
        "MC: share.linkedIn"
      );
      expect(linkedinButton).toHaveAttribute("data-channel", "linkedin");
      expect(linkedinSVG).toBeInTheDocument();
    });

    it("should apply the following data-gtm attribute to the linkedin button if the linkedin prop is true", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            linkedin: true
          })}
        />
      );

      const linkedinButton = screen.getByTestId("icon-button");

      expect(linkedinButton).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-share1","label":"MC: share.linkedIn","action":"linkedin"}'
      );
    });

    it("should not render the linkedin button if the linkedin prop is false", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            linkedin: false
          })}
        />
      );

      const linkedinButton = screen.queryByTestId("icon-button");
      expect(linkedinButton).not.toBeInTheDocument();
    });

    it("should not render the linkedin button if the linkedin prop is null", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            linkedin: null
          })}
        />
      );

      const linkedinButton = screen.queryByTestId("icon-button");
      expect(linkedinButton).not.toBeInTheDocument();
    });
  });

  describe("Facebook Button", () => {
    it("should render the facebook button if the facebook prop is true, with the share microCopy text as the aria-label", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            facebook: true
          })}
        />
      );

      const facebookButton = screen.getByTestId("icon-button");
      const facebookSVG = screen.getByTestId("share-widget-icon-facebook");

      expect(facebookButton).toBeInTheDocument();
      expect(facebookButton).toHaveAttribute(
        "aria-label",
        "MC: share.facebook"
      );
      expect(facebookButton).toHaveAttribute("data-channel", "facebook");
      expect(facebookSVG).toBeInTheDocument();
    });

    it("should apply the following data-gtm attribute to the facebook button if the facebook prop is true", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            facebook: true
          })}
        />
      );

      const facebookButton = screen.getByTestId("icon-button");

      expect(facebookButton).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-share1","label":"MC: share.facebook","action":"facebook"}'
      );
    });

    it("should not render the facebook button if the facebook prop is false", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            facebook: false
          })}
        />
      );

      const facebookButton = screen.queryByTestId("icon-button");
      expect(facebookButton).not.toBeInTheDocument();
    });

    it("should not render the facebook button if the facebook prop is null", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            facebook: null
          })}
        />
      );

      const facebookButton = screen.queryByTestId("icon-button");
      expect(facebookButton).not.toBeInTheDocument();
    });
  });

  describe("Pinterest Button", () => {
    it("should render the pinterest button if the pinterest prop is true, with the share microCopy text as the aria-label", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            pinterest: true
          })}
        />
      );

      const pinterestButton = screen.getByTestId("icon-button");
      const pinterestSVG = screen.getByTestId("share-widget-icon-pinterest");

      expect(pinterestButton).toBeInTheDocument();
      expect(pinterestButton).toHaveAttribute(
        "aria-label",
        "MC: share.pinterest"
      );
      expect(pinterestButton).toHaveAttribute("data-channel", "pinterest");
      expect(pinterestSVG).toBeInTheDocument();
    });

    it("should apply the following data-gtm attribute to the pinterest button if the pinterest prop is true", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            pinterest: true
          })}
        />
      );

      const pinterestButton = screen.getByTestId("icon-button");

      expect(pinterestButton).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-share1","label":"MC: share.pinterest","action":"pinterest"}'
      );
    });

    it("should not render the pinterest button if the pinterest prop is false", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            pinterest: false
          })}
        />
      );

      const pinterestButton = screen.queryByTestId("icon-button");
      expect(pinterestButton).not.toBeInTheDocument();
    });

    it("should not render the pinterest button if the pinterest prop is null", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            pinterest: null
          })}
        />
      );

      const pinterestButton = screen.queryByTestId("icon-button");
      expect(pinterestButton).not.toBeInTheDocument();
    });
  });

  describe("Twitter Button", () => {
    it("should render the twitter button if the twitter prop is true, with the share microCopy text as the aria-label", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            twitter: true
          })}
        />
      );

      const twitterButton = screen.getByTestId("icon-button");
      const twitterSVG = screen.getByTestId("share-widget-icon-twitter");

      expect(twitterButton).toBeInTheDocument();
      expect(twitterButton).toHaveAttribute("aria-label", "MC: share.twitter");
      expect(twitterButton).toHaveAttribute("data-channel", "twitter");
      expect(twitterSVG).toBeInTheDocument();
    });

    it("should apply the following data-gtm attribute to the twitter button if the twitter prop is true", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            twitter: true
          })}
        />
      );

      const twitterButton = screen.getByTestId("icon-button");

      expect(twitterButton).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-share1","label":"MC: share.twitter","action":"twitter"}'
      );
    });

    it("should not render the twitter button if the twitter prop is false", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            twitter: false
          })}
        />
      );

      const twitterButton = screen.queryByTestId("icon-button");
      expect(twitterButton).not.toBeInTheDocument();
    });

    it("should not render the twitter button if the twitter prop is null", () => {
      renderWithProviders(
        <ShareWidgetSection
          data={createShareWidgetData({
            twitter: null
          })}
        />
      );

      const twitterButton = screen.queryByTestId("icon-button");
      expect(twitterButton).not.toBeInTheDocument();
    });
  });
});
