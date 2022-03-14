import React from "react";
import { fireEvent } from "@testing-library/react";
import Button from "../../button/Button";
import ShowMore from "../ShowMore";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("ShowMore component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <ShowMore openButton={<Button>Show more</Button>}>
        Show more content
      </ShowMore>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with content expanded", () => {
    const { container } = renderWithThemeProvider(
      <ShowMore openButton={<Button>Show more</Button>} isExpanded={true}>
        Show more content
      </ShowMore>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when trigger button is clicked", () => {
    const { getByText, container } = renderWithThemeProvider(
      <ShowMore openButton={<Button>Trigger</Button>}>
        Show more content
      </ShowMore>
    );

    const triggerButton = getByText("Trigger");
    fireEvent.click(triggerButton);

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with close button", () => {
    const { getByText, container } = renderWithThemeProvider(
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
    const { getByText, container } = renderWithThemeProvider(
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
