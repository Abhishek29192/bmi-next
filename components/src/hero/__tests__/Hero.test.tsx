import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import imageSource from "mock-image.jpg";
import Button from "../../button/Button";
import Hero from "../Hero";

describe("Hero component", () => {
  it("renders level 1", () => {
    const { container } = render(
      <Hero
        media={<img src={imageSource} alt="Lorem ipsum" />}
        title="H1 Heading"
        level={1}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non
        tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus
        suscipit dolor nisl, nec vestibulum odio molestie tincidunt.
      </Hero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders level 1 with CTA", () => {
    const { container } = render(
      <Hero
        media={<img src={imageSource} alt="Lorem ipsum" />}
        title="H1 Heading"
        level={1}
        cta={<Button label="CTA action">CTA action</Button>}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non
        tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus
        suscipit dolor nisl, nec vestibulum odio molestie tincidunt.
      </Hero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders level 2", () => {
    const { container } = render(<Hero title="H1 Heading" level={2} />);
    expect(container).toMatchSnapshot();
  });

  it("renders level 3", () => {
    const { container } = render(<Hero title="H1 Heading" level={3} />);
    expect(container).toMatchSnapshot();
  });
  describe("Hero component with keyline", () => {
    it("renders level 1 with keyline ", () => {
      const { container } = render(
        <Hero title="H1 Heading" level={3} isHeroKeyLine={true} />
      );
      expect(container).toMatchSnapshot();
    });

    it("renders level 0 with keyline", () => {
      const { container } = render(
        <Hero
          heroes={[
            {
              title: "Title",

              children: ""
            }
          ]}
          level={0}
          isHeroKeyLine={true}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("renders with no underline", () => {
      const { container } = render(
        <Hero
          heroes={[
            {
              title: "Title",

              children: "",
              hasUnderline: false
            }
          ]}
          level={0}
          isHeroKeyLine={true}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  it("can switch to next hero", () => {
    const { container, getByLabelText } = render(
      <Hero
        heroes={[
          { title: "Title 1", children: "Children 1" },
          { title: "Title 2", children: "Children 2" },
          { title: "Title 3", children: "Children 3" }
        ]}
        level={0}
      />
    );

    expect(container.querySelector(".number--active")).toHaveTextContent("01");
    getByLabelText("next").click();
    expect(container.querySelector(".number--active")).toHaveTextContent("02");
  });

  it("can switch to previous hero", () => {
    const { container, getByLabelText } = render(
      <Hero
        heroes={[
          { title: "Title 1", children: "Children 1" },
          { title: "Title 2", children: "Children 2" },
          { title: "Title 3", children: "Children 3" }
        ]}
        level={0}
      />
    );

    expect(container.querySelector(".number--active")).toHaveTextContent("01");
    getByLabelText("previous").click();
    expect(container.querySelector(".number--active")).toHaveTextContent("03");
  });
});
