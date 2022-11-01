import React from "react";
import imageSource from "mock-image.jpg";
import iconSource from "mock-icon.svg";
import ProfileCard from "../ProfileCard";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("ProfileCard component", () => {
  it("renders correctly with an image", () => {
    const { container } = renderWithThemeProvider(
      <ProfileCard
        imageSource={imageSource}
        className="name"
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

  it("renders correctly without an image", () => {
    const { container } = renderWithThemeProvider(
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
    expect(container).toMatchSnapshot();
  });

  it("renders an element if the image source is a component", () => {
    const { container } = renderWithThemeProvider(
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

  it("renders correctly if does not have children", () => {
    const { container } = renderWithThemeProvider(
      <ProfileCard
        imageSource={<h1>Something here</h1>}
        body={<ProfileCard.Body name="Richard Stallman" />}
      ></ProfileCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly ProfileRow if icon not passed", () => {
    const { container } = renderWithThemeProvider(
      <ProfileCard
        imageSource={<h1>Something here</h1>}
        body={<ProfileCard.Body name="Richard Stallman" title="Code Wizard" />}
      >
        <ProfileCard.Row action={{ model: "htmlLink", href: "/" }}>
          Profile line with link
        </ProfileCard.Row>
      </ProfileCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if ProfileCard.Body title passed", () => {
    const { container } = renderWithThemeProvider(
      <ProfileCard
        imageSource={<h1>Something here</h1>}
        body={<ProfileCard.Body name="Richard Stallman" title="Code Wizard" />}
      ></ProfileCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if ProfileCard.Body style passed", () => {
    const { container } = renderWithThemeProvider(
      <ProfileCard
        imageSource={<h1>Something here</h1>}
        body={
          <ProfileCard.Body name="Richard Stallman" style={{ color: "red" }} />
        }
      ></ProfileCard>
    );
    expect(container).toMatchSnapshot();
  });
});
