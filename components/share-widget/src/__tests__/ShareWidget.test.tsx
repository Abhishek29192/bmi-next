import { render, fireEvent } from "@testing-library/react";
import React from "react";
import ShareWidget from "../";

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
  it("renders correctly", () => {
    const { container } = render(<ShareWidget channels={channels} />);
    expect(container).toMatchSnapshot();
  });
  it("renders left aligned", () => {
    const { container } = render(
      <ShareWidget channels={channels} isLeftAligned />
    );
    expect(container).toMatchSnapshot();
  });
  it("shares on Facebook", () => {
    window.open = jest.fn();
    const { container, getByLabelText } = render(
      <ShareWidget channels={channels} isLeftAligned />
    );
    const facebookButton = getByLabelText(channels[4].label);
    fireEvent.click(facebookButton);
    // @todo: Can we check window.open has been called?
    expect(container).toMatchSnapshot();
  });
  // @todo: Reinstate email tests when implemented
  // it("renders dialog when email clicked", () => {
  //   const { container, getByLabelText } = render(
  //     <ShareWidget channels={channels} isLeftAligned />
  //   );

  //   const emailButton = getByLabelText("Share by email");
  //   fireEvent.click(emailButton);

  //   expect(container).toMatchSnapshot();
  // });
});
