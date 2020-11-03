import { render, fireEvent } from "@testing-library/react";
import React from "react";
import ShareWidget from "../";

const channels = [
  { type: "copy" as "copy", label: "Copy to clipboard" },
  {
    type: "email" as "email",
    label: "Share by email",
    apiUrl: "mailto:?body="
  },
  {
    type: "linkedin" as "linkedin",
    label: "Share on LinkedIn",
    apiUrl: "https://www.linkedin.com/shareArticle?mini=true&url="
  },
  {
    type: "twitter" as "twitter",
    label: "Share on Twitter",
    apiUrl: "https://twitter.com/intent/tweet?url="
  },
  {
    type: "facebook" as "facebook",
    label: "Share on Facebook",
    apiUrl: "https://www.facebook.com/sharer/sharer.php?u="
  },
  {
    type: "pinterest" as "pinterest",
    label: "Share on Pinterest",
    apiUrl: "https://www.pinterest.com/pin/create/button/?url="
  }
];

describe("ShareWidget component", () => {
  it("renders correctly", () => {
    const { container } = render(<ShareWidget channels={channels} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders left aligned", () => {
    const { container } = render(
      <ShareWidget channels={channels} isLeftAligned />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("shares on Facebook", () => {
    window.open = jest.fn();
    const { container, getByLabelText } = render(
      <ShareWidget channels={channels} isLeftAligned />
    );
    const facebookButton = getByLabelText(channels[4].label);
    fireEvent.click(facebookButton);
    // @todo: Can we check window.open has been called?
    expect(container.firstChild).toMatchSnapshot();
  });
  // @todo: Reinstate email tests when implemented
  // it("renders dialog when email clicked", () => {
  //   const { container, getByLabelText } = render(
  //     <ShareWidget channels={channels} isLeftAligned />
  //   );

  //   const emailButton = getByLabelText("Share by email");
  //   fireEvent.click(emailButton);

  //   expect(container.firstChild).toMatchSnapshot();
  // });
});
