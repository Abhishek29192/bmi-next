import React from "react";
import { render } from "@testing-library/react";
import imageSource from "mock-image.jpg";
import iconSource from "mock-icon.svg";
import ProfileCard from "../";

describe("ProfileCard component", () => {
  it("renders correctly", () => {
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
});
