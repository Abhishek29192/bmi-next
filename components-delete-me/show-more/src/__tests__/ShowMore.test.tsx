import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "@bmi-digital/components/button";
import ShowMore from "../";

describe("ShowMore component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ShowMore openButton={<Button>Show more</Button>}>
        Show more content
      </ShowMore>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with content expanded", () => {
    const { container } = render(
      <ShowMore openButton={<Button>Show more</Button>} isExpanded={true}>
        Show more content
      </ShowMore>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when trigger button is clicked", () => {
    const { getByText, container } = render(
      <ShowMore openButton={<Button>Trigger</Button>}>
        Show more content
      </ShowMore>
    );

    const triggerButton = getByText("Trigger");
    fireEvent.click(triggerButton);

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with close button", () => {
    const { getByText, container } = render(
      <ShowMore
        openButton={<Button>Trigger</Button>}
        closeButton={<Button>Close</Button>}
      >
        Show more content
      </ShowMore>
    );

    const triggerButton = getByText("Trigger");
    fireEvent.click(triggerButton);

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with close button is clicked", () => {
    const { getByText, container } = render(
      <ShowMore
        openButton={<Button>Trigger</Button>}
        closeButton={<Button>Close</Button>}
        isExpanded={true}
      >
        Show more content
      </ShowMore>
    );

    const triggerButton = getByText("Close");
    fireEvent.click(triggerButton);

    expect(container).toMatchSnapshot();
  });
});
