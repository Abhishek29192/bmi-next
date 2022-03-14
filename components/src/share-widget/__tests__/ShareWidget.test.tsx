import { fireEvent } from "@testing-library/react";
import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import ShareWidget from "../ShareWidget";

const url = "http://test.com";
Object.defineProperty(window, "location", {
  value: {
    href: url
  }
});
const windowOpen = jest.fn();
Object.defineProperty(window, "open", {
  value: windowOpen
});

const writeText = jest.fn().mockImplementation(() => Promise.resolve());

const channels = [
  { type: "copy" as const, label: "Copy to clipboard" },
  {
    type: "email" as const,
    label: "Share by email",
    apiUrl: "mailto:?body="
  },
  {
    type: "linkedin" as const,
    label: "Share on LinkedIn",
    apiUrl: "https://www.linkedin.com/shareArticle?mini=true&url="
  },
  {
    type: "twitter" as const,
    label: "Share on Twitter",
    apiUrl: "https://twitter.com/intent/tweet?url="
  },
  {
    type: "facebook" as const,
    label: "Share on Facebook",
    apiUrl: "https://www.facebook.com/sharer/sharer.php?u="
  },
  {
    type: "pinterest" as const,
    label: "Share on Pinterest",
    apiUrl: "https://www.pinterest.com/pin/create/button/?url="
  }
];

describe("ShareWidget component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  const additionalChannels = [
    {
      type: "facebook" as const,
      label: "Share on Facebook",
      apiUrl: "https://www.facebook.com/sharer/sharer.php?u={{message}}"
    },
    {
      type: "email" as const,
      label: "Share by email",
      apiUrl: "mailto:?body={{href}}"
    }
  ];
  it("renders correctly", () => {
    const { getByLabelText } = renderWithThemeProvider(
      <ShareWidget channels={channels} />
    );
    const copy = getByLabelText("Copy to clipboard");
    const email = getByLabelText("Share by email");
    const linkedIn = getByLabelText("Share on LinkedIn");
    const twitter = getByLabelText("Share on Twitter");
    const facebook = getByLabelText("Share on Facebook");
    const pinterest = getByLabelText("Share on Pinterest");
    expect(copy).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(linkedIn).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
    expect(facebook).toBeInTheDocument();
    expect(pinterest).toBeInTheDocument();
  });
  it("renders left aligned", () => {
    const { container } = renderWithThemeProvider(
      <ShareWidget channels={channels} isLeftAligned />
    );
    expect(container.firstChild).toHaveClass("test-shareWidget-left-aligned");
  });
  it("shares on Facebook", () => {
    const { getByLabelText } = renderWithThemeProvider(
      <ShareWidget channels={channels} />
    );
    const facebookButton = getByLabelText(channels[4].label);
    fireEvent.click(facebookButton);
    expect(windowOpen).toBeCalledTimes(1);
  });

  it("shares on Facebook if message provided", () => {
    const { getByLabelText } = renderWithThemeProvider(
      <ShareWidget channels={additionalChannels} message="Test message" />
    );
    const facebookButton = getByLabelText(additionalChannels[0].label);
    fireEvent.click(facebookButton);
    expect(windowOpen).toBeCalledWith(
      "https://www.facebook.com/sharer/sharer.php?u=Test message",
      "Share",
      "height=400,width=555"
    );
  });

  it("shares on Facebook if message NOT provided", () => {
    const { getByLabelText } = renderWithThemeProvider(
      <ShareWidget channels={additionalChannels} />
    );
    const facebookButton = getByLabelText(additionalChannels[0].label);
    fireEvent.click(facebookButton);
    expect(windowOpen).toBeCalledWith(
      "https://www.facebook.com/sharer/sharer.php?u=",
      "Share",
      "height=400,width=555"
    );
  });

  it("click on Copy", () => {
    jest.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText
      }
    });
    const { getByLabelText } = renderWithThemeProvider(
      <ShareWidget channels={channels} />
    );
    const copyButton = getByLabelText(channels[0].label);
    fireEvent.click(copyButton);

    expect(writeText).toBeCalledWith(url);
  });

  it("click on Copy and catch error", () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: undefined
      }
    });
    const { getByLabelText } = renderWithThemeProvider(
      <ShareWidget channels={channels} />
    );
    const copyButton = getByLabelText(channels[0].label);
    fireEvent.click(copyButton);
    expect(writeText).toBeCalledTimes(0);
  });

  it("shares on Email if template {{href}} present", () => {
    const { getByLabelText } = renderWithThemeProvider(
      <ShareWidget channels={additionalChannels} />
    );
    const emailButton = getByLabelText(additionalChannels[1].label);
    fireEvent.click(emailButton);
    expect(location.href).toEqual(`mailto:?body=${url}`);
  });

  it("shares on Email", () => {
    const { getByLabelText } = renderWithThemeProvider(
      <ShareWidget channels={channels} />
    );
    const emailButton = getByLabelText(channels[1].label);
    fireEvent.click(emailButton);
    expect(location.href).toEqual("mailto:?body=");
  });

  // @todo: Reinstate email tests when implemented
  // it("renders dialog when email clicked", () => {
  //   const { container, getByLabelText } = renderWithThemeProvider(
  //     <ShareWidget channels={channels} isLeftAligned />
  //   );

  //   const emailButton = getByLabelText("Share by email");
  //   fireEvent.click(emailButton);

  //   expect(container).toMatchSnapshot();
  // });
});
