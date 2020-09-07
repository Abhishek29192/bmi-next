import React from "react";
import Villain from "../";
import { render } from "@testing-library/react";
import testImage from "test-image.png";

describe("Villain component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Villain
        title="H2 Heading"
        imageSource={testImage}
        cta={{ label: "Call to action" }}
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
      <Villain title="H2 Heading" imageSource={testImage} isReversed>
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
        imageSource={testImage}
        cta={{ label: "Call to action" }}
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
        imageSource={testImage}
        cta={{ label: "Call to action" }}
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
});
