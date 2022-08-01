import { fireEvent, render } from "@testing-library/react";
import mockImage from "path-to-image.png";
import MockLogo from "path-to-logo.svg";
import React from "react";
import ProductOverviewPane, { Props } from "../ProductOverviewPane";

const attributes: Props["attributes"] = [
  {
    name: "Colour",
    type: "thumbnails",
    unavailableMicroCopy: "unavailableMicroCopy",
    variants: [
      {
        label: "Black",
        thumbnail: mockImage,
        availability: true
      },
      {
        label: "Brown",
        thumbnail: mockImage,
        isSelected: true,
        availability: true,
        action: { model: "htmlLink", href: "#" }
      }
    ]
  },
  {
    name: "Size",
    unavailableMicroCopy: "unavailableMicroCopy 2",
    variants: [
      {
        label: "22cm x 42cm",
        isSelected: true,
        availability: true
      },
      {
        label: "12cm x 22cm",
        action: { model: "htmlLink", href: "#" },
        availability: true
      },
      {
        label: "30cm x 62cm",
        availability: true
      }
    ]
  }
];

describe("ProductOverviewPane component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb="1394983720195"
        nobbLabel="label"
        attributes={attributes}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with children", () => {
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb="1394983720195"
        nobbLabel="label"
        attributes={attributes}
      >
        <div>Some container</div>
        <p>some text</p>
      </ProductOverviewPane>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with empty variants", () => {
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb="1394983720195"
        nobbLabel="label"
        attributes={[
          {
            name: "Size",
            variants: []
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if nobb === null", () => {
    const component = () => <div>thumbnail</div>;
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb={null}
        nobbLabel="label"
        thumbnailComponent={component}
        attributes={[
          {
            name: "Size",
            type: "thumbnails",
            variants: [
              {
                label: "22cm x 42cm",
                isSelected: true,
                availability: true
              },
              {
                label: "12cm x 22cm",
                availability: false
              }
            ]
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if attribute type === chips", () => {
    const component = () => <div>thumbnail</div>;
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb="1394983720195"
        nobbLabel="label"
        thumbnailComponent={component}
        attributes={[
          {
            name: "Size",
            type: "chips",
            variants: [
              {
                label: "22cm x 42cm",
                isSelected: true,
                availability: true
              },
              {
                label: "12cm x 22cm",
                availability: false
              }
            ]
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if attributesis empty array", () => {
    const component = () => <div>thumbnail</div>;
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb={null}
        nobbLabel="label"
        thumbnailComponent={component}
        attributes={[]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if some variant has isSelected equals false", () => {
    const component = () => <div>thumbnail</div>;
    const { container } = render(
      <ProductOverviewPane
        name="Type S Roof Shingles"
        brandLogo={MockLogo}
        nobb={null}
        nobbLabel="label"
        thumbnailComponent={component}
        attributes={[
          {
            name: "Size",
            type: "thumbnails",
            variants: [
              {
                label: "22cm x 42cm",
                availability: true,
                isSelected: false
              },
              {
                label: "12cm x 22cm",
                availability: false
              }
            ]
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  describe("renders tooltips with unavailableMicrocopy when hover attribute ", () => {
    it("for chips", async () => {
      const { getByText, findByText } = render(
        <ProductOverviewPane
          name="Type S Roof Shingles"
          brandLogo={MockLogo}
          nobb="1394983720195"
          nobbLabel="label"
          attributes={[
            {
              name: "Size",
              type: "chips",
              unavailableMicroCopy: "unavailableMicroCopy 2",
              variants: [
                {
                  label: "22cm x 42cm",
                  isSelected: true,
                  availability: true
                },
                {
                  label: "12cm x 22cm",
                  action: { model: "htmlLink", href: "#" },
                  availability: false
                }
              ]
            }
          ]}
        />
      );
      const chip = getByText("12cm x 22cm");

      fireEvent.mouseOver(chip);

      expect(await findByText("unavailableMicroCopy 2")).toBeTruthy();
    });
    it("for thumbnails", async () => {
      const { getByText, findByText } = render(
        <ProductOverviewPane
          name="Type S Roof Shingles"
          brandLogo={MockLogo}
          nobb="1394983720195"
          nobbLabel="label"
          attributes={[
            {
              name: "Colour",
              type: "thumbnails",
              unavailableMicroCopy: "unavailableMicroCopy",
              variants: [
                {
                  label: "Black",
                  thumbnail: mockImage,
                  isSelected: true,
                  availability: true
                },
                {
                  label: "Brown",
                  thumbnail: mockImage,
                  availability: false,
                  isSelected: false,
                  action: { model: "htmlLink", href: "#" }
                }
              ]
            }
          ]}
        />
      );
      const thumbnail = getByText("Brown");

      fireEvent.mouseOver(thumbnail);

      expect(await findByText("unavailableMicroCopy")).toBeTruthy();
    });
  });

  describe("does not render tooltips with unavailableMicrocopy when hover attribute without action ", () => {
    it("for chips", async () => {
      const { getByText, queryByText } = render(
        <ProductOverviewPane
          name="Type S Roof Shingles"
          brandLogo={MockLogo}
          nobb="1394983720195"
          nobbLabel="label"
          attributes={[
            {
              name: "Size",
              type: "chips",
              unavailableMicroCopy: "unavailableMicroCopy 2",
              variants: [
                {
                  label: "22cm x 42cm",
                  isSelected: true,
                  availability: true
                },
                {
                  label: "12cm x 22cm",
                  availability: false
                }
              ]
            }
          ]}
        />
      );
      const chip = getByText("12cm x 22cm");

      fireEvent.mouseOver(chip);

      expect(await queryByText("unavailableMicroCopy 2")).toBeFalsy();
    });
    it("for thumbnails", async () => {
      const { getByText, queryByText } = render(
        <ProductOverviewPane
          name="Type S Roof Shingles"
          brandLogo={MockLogo}
          nobb="1394983720195"
          nobbLabel="label"
          attributes={[
            {
              name: "Colour",
              type: "thumbnails",
              unavailableMicroCopy: "unavailableMicroCopy",
              variants: [
                {
                  label: "Black",
                  thumbnail: mockImage,
                  isSelected: true,
                  availability: true
                },
                {
                  label: "Brown",
                  thumbnail: mockImage,
                  availability: false,
                  isSelected: false
                }
              ]
            }
          ]}
        />
      );
      const thumbnail = getByText("Brown");

      fireEvent.mouseOver(thumbnail);

      expect(await queryByText("unavailableMicroCopy")).toBeFalsy();
    });
  });
});
