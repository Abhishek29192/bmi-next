import React from "react";
import Button from "@bmi/button";
import { render } from "@testing-library/react";
import testImage from "test-image.png";
import Villain from "../";

describe("Villain component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        media={<img src={testImage} alt="Lorem ipsum" />}
        cta={<Button>Call to action</Button>}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
        blandit, finibus augue et, ultricies felis. In id nunc nunc. Nullam ac
        nulla justo. Sed sollicitudin volutpat arcu at laoreet. Ut vel augue
        nisi. Pellentesque egestas sapien et mauris rutrum laoreet. Integer
        tellus enim, posuere vel nibh suscipit, rhoncus ornare lectus. Mauris ac
        interdum nibh, quis dictum nulla.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders reversed", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        media={<img src={testImage} alt="Lorem ipsum" />}
        isReversed
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
        blandit, finibus augue et, ultricies felis. In id nunc nunc. Nullam ac
        nulla justo. Sed sollicitudin volutpat arcu at laoreet. Ut vel augue
        nisi. Pellentesque egestas sapien et mauris rutrum laoreet. Integer
        tellus enim, posuere vel nibh suscipit, rhoncus ornare lectus. Mauris ac
        interdum nibh, quis dictum nulla.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders full size", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        media={<img src={testImage} alt="Lorem ipsum" />}
        cta={<Button>Call to action</Button>}
        isFullWidth
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
        blandit, finibus augue et, ultricies felis. In id nunc nunc. Nullam ac
        nulla justo. Sed sollicitudin volutpat arcu at laoreet. Ut vel augue
        nisi. Pellentesque egestas sapien et mauris rutrum laoreet. Integer
        tellus enim, posuere vel nibh suscipit, rhoncus ornare lectus. Mauris ac
        interdum nibh, quis dictum nulla.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders full size and reversed", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        media={<img src={testImage} alt="Lorem ipsum" />}
        cta={<Button>Call to action</Button>}
        isFullWidth
        isReversed
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
        blandit, finibus augue et, ultricies felis. In id nunc nunc. Nullam ac
        nulla justo. Sed sollicitudin volutpat arcu at laoreet. Ut vel augue
        nisi. Pellentesque egestas sapien et mauris rutrum laoreet. Integer
        tellus enim, posuere vel nibh suscipit, rhoncus ornare lectus. Mauris ac
        interdum nibh, quis dictum nulla.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with deprecated imageSource", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        imageSource={testImage}
        cta={<Button>Call to action</Button>}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
        blandit, finibus augue et, ultricies felis. In id nunc nunc. Nullam ac
        nulla justo. Sed sollicitudin volutpat arcu at laoreet. Ut vel augue
        nisi. Pellentesque egestas sapien et mauris rutrum laoreet. Integer
        tellus enim, posuere vel nibh suscipit, rhoncus ornare lectus. Mauris ac
        interdum nibh, quis dictum nulla.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with deprecated imageSource as react node", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        imageSource={<img src={testImage} alt="Lorem ipsum" />}
        cta={<Button>Call to action</Button>}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel nisl
        blandit, finibus augue et, ultricies felis. In id nunc nunc. Nullam ac
        nulla justo. Sed sollicitudin volutpat arcu at laoreet. Ut vel augue
        nisi. Pellentesque egestas sapien et mauris rutrum laoreet. Integer
        tellus enim, posuere vel nibh suscipit, rhoncus ornare lectus. Mauris ac
        interdum nibh, quis dictum nulla.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with deprecated imageSource on a FullWidth", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        imageSource={testImage}
        cta={<Button>Call to action</Button>}
        isFullWidth
      >
        Lorem ipsum dolor sit amet.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with deprecated imageSource as react node on a FullWidth ", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        imageSource={<img src={testImage} alt="Lorem ipsum" />}
        cta={<Button>Call to action</Button>}
        isFullWidth
      >
        Lorem ipsum dolor sit amet.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly on reversed when screen size is larger than sm ", () => {
    Object.defineProperty(window, "matchMedia", {
      value: () => {
        return {
          matches: true,
          addListener: () => {},
          removeListener: () => {}
        };
      }
    });
    const { container } = render(
      <Villain
        title="H2 Heading"
        cta={<Button>Call to action</Button>}
        isReversed
      >
        Lorem ipsum dolor sit amet.
      </Villain>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
