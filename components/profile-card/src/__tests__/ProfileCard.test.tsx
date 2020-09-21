import React from "react";
import ProfileCard from "../";
import { render } from "@testing-library/react";
import imageSource from "mock-image.jpg";
import iconSource from "mock-icon.svg";

describe("ProfileCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ProfileCard
        name="Richard Stallman"
        title="Wizard"
        imageSource={imageSource}
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
