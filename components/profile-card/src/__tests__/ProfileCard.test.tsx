import React from "react";
import { render } from "@testing-library/react";
import imageSource from "mock-image.jpg";
import iconSource from "mock-icon.svg";
import ProfileCard from "../";

describe("ProfileCard component", () => {
  it("renders correctly with an image", () => {
    const { container } = render(
      <ProfileCard
        imageSource={imageSource}
        body={<ProfileCard.Body name="Richard Stallman" title="Code Wizard" />}
      >
        <ProfileCard.Row
          action={{ model: "htmlLink", href: "/" }}
          icon={iconSource}
        >
          Profile line with link
        </ProfileCard.Row>
        <ProfileCard.Row icon={iconSource}>
          Profile line without linkn
        </ProfileCard.Row>
      </ProfileCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly without an image", () => {
    const { container } = render(
      <ProfileCard
        body={<ProfileCard.Body name="Richard Stallman" title="Code Wizard" />}
      >
        <ProfileCard.Row
          action={{ model: "htmlLink", href: "/" }}
          icon={iconSource}
        >
          Profile line with link
        </ProfileCard.Row>
        <ProfileCard.Row icon={iconSource}>
          Profile line without linkn
        </ProfileCard.Row>
      </ProfileCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders an element if the image source is a component", () => {
    const { container } = render(
      <ProfileCard
        imageSource={<h1>Something here</h1>}
        body={<ProfileCard.Body name="Richard Stallman" title="Code Wizard" />}
      >
        <ProfileCard.Row
          action={{ model: "htmlLink", href: "/" }}
          icon={iconSource}
        >
          Profile line with link
        </ProfileCard.Row>
        <ProfileCard.Row icon={iconSource}>
          Profile line without linkn
        </ProfileCard.Row>
      </ProfileCard>
    );
    expect(container).toMatchSnapshot();
  });
});
