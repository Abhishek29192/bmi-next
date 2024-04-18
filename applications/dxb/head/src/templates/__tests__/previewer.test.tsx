import { render, screen } from "@testing-library/react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Previewer from "../previewer";

describe("Previewer", () => {
  const data: { contentfulSite } = {
    contentfulSite: {
      countryCode: "no",
      pages: [
        {
          slug: "slug",
          path: "path"
        }
      ]
    }
  };
  const locationSpy = jest.spyOn(window, "location", "get");
  const pushMock = jest.fn();
  jest.mock("next/router", () => ({
    useRouter: jest.fn().mockImplementation(() => ({
      push: (route: string, options?: string) => pushMock(route, options)
    }))
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("render correctly", () => {
    locationSpy.mockReturnValue({ ...window.location, search: "slug=slug" });
    const { countryCode, pages } = data.contentfulSite;
    const { container } = render(<Previewer data={data} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText("Redirecting to slug")).toBeTruthy();
    expect(pushMock).toHaveBeenCalledWith(`/${countryCode}/${pages[0].path}`);
  });

  it("return null when window is undefined", () => {
    jest.spyOn(window, "window", "get").mockReturnValueOnce(undefined);
    const view = renderToStaticMarkup(<Previewer data={data} />);

    expect(view).toMatchSnapshot();
  });

  it("render correctly with no slug in window.location.search", () => {
    locationSpy.mockReturnValue({ ...window.location, search: "" });
    const { container } = render(<Previewer data={data} />);

    expect(container).toMatchSnapshot();
    expect(
      screen.getByText(
        "You need to specify a page slug in the URL. e.g. previewer?slug=metal-tiles."
      )
    ).toBeTruthy();
  });

  it("render correctly with no matching slug", () => {
    locationSpy.mockReturnValue({ ...window.location, search: "slug=noMatch" });
    const { container } = render(<Previewer data={data} />);

    expect(container).toMatchSnapshot();
    expect(
      screen.getByText(
        "There is no page for the noMatch slug. Make sure you assign it to the site."
      )
    ).toBeTruthy();
  });

  it("render correctly with multiple slug querystring", () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "slug=slug&slug=slug2"
    });
    const { countryCode, pages } = data.contentfulSite;
    const { container } = render(<Previewer data={data} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText(`Redirecting to slugslug2`)).toBeTruthy();
    expect(pushMock).toHaveBeenCalledWith(`/${countryCode}/${pages[0].path}`);
  });
});
