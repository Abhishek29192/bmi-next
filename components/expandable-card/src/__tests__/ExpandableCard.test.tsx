import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import BuildIcon from "test.svg";
import ExpandableCard from "..";

afterEach(cleanup);

describe("ExpandableCard component", () => {
  const transitionEndEvent = new Event("transitionend", {
    bubbles: true,
    cancelable: false
  });

  it("renders correctly", () => {
    const { container } = render(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        footer="consectetur adipiscing elit"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with no footer", () => {
    const { container } = render(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("triggers a onClick event", async () => {
    const onClick = jest.fn();
    const title = "Lorem Ipsum";

    const { findByText } = render(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        onClick={onClick}
      />
    );

    fireEvent.click(await findByText(title));
    expect(onClick).toBeCalled();
  });
  it("triggers a onCloseClick event", async () => {
    const closeLabel = "Close me";
    const onCloseClick = jest.fn();
    const { findByLabelText } = render(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        closeLabel={closeLabel}
        isExpanded
        onCloseClick={onCloseClick}
      />
    );

    fireEvent.click(await findByLabelText(closeLabel));
    expect(onCloseClick).toBeCalled();
  });
  it("renders an expanded card", () => {
    const { container } = render(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        isExpanded
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("it expands the card when changing isExpanded", () => {
    const title = "Lorem Ipsum";
    const { container, rerender, getByText } = render(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        isExpanded={false}
      />
    );

    rerender(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        isExpanded={true}
      />
    );
    // @ts-ignore propertyName is meant to be read-only.
    transitionEndEvent.propertyName = "height";
    fireEvent(getByText(title), transitionEndEvent);

    expect(container).toMatchSnapshot();

    rerender(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        isExpanded={false}
      />
    );

    // @ts-ignore propertyName is meant to be read-only.
    transitionEndEvent.propertyName = "height";
    fireEvent(getByText(title), transitionEndEvent);

    expect(container).toMatchSnapshot();
  });
  it("it triggers an onAnimationEnd event", () => {
    const onAnimationEnd = jest.fn();
    const title = "Lorem Ipsum";
    const { rerender, getByText } = render(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        isExpanded={false}
        onAnimationEnd={onAnimationEnd}
      />
    );

    rerender(
      <ExpandableCard
        icon={BuildIcon}
        title="Lorem Ipsum"
        body="Sit dolor amet"
        isExpanded={true}
        onAnimationEnd={onAnimationEnd}
      />
    );

    // @ts-ignore propertyName is meant to be read-only.
    transitionEndEvent.propertyName = "height";
    fireEvent(getByText(title), transitionEndEvent);

    // @ts-ignore propertyName is meant to be read-only.
    transitionEndEvent.propertyName = "width";
    fireEvent(getByText(title), transitionEndEvent);

    expect(onAnimationEnd.mock.calls).toMatchSnapshot();
  });

  describe("ExpandableCard.List component", () => {
    const items = [
      {
        icon: BuildIcon,
        title: "Lorem Ipsum 0",
        body: "Sit dolor amet",
        isExpanded: true
      },
      {
        icon: BuildIcon,
        title: "Lorem Ipsum 1",
        body: "Sit dolor amet"
      },
      {
        icon: BuildIcon,
        title: "Lorem Ipsum 2",
        body: "Sit dolor amet"
      },
      {
        icon: BuildIcon,
        title: "Lorem Ipsum 3",
        body: "Sit dolor amet"
      }
    ];

    it("it renders a list of cards", () => {
      const { container } = render(
        <ExpandableCard.List
          items={items.filter(({ isExpanded }) => !isExpanded)}
        />
      );

      expect(container).toMatchSnapshot();
    });

    it("renders with one card expanded", () => {
      const { container } = render(<ExpandableCard.List items={items} />);

      expect(container).toMatchSnapshot();
    });
    it("handles multiple cards expanded by default", () => {
      const { container } = render(
        <ExpandableCard.List
          items={[
            ...items,
            {
              icon: BuildIcon,
              title: "Lorem Ipsum",
              body: "Sit dolor amet",
              isExpanded: true
            }
          ]}
        />
      );

      expect(container).toMatchSnapshot();
    });
    it("sets the clicked card to expanded", () => {
      const { container, getByText } = render(
        <ExpandableCard.List items={items} />
      );

      fireEvent.click(getByText("Lorem Ipsum 1"));

      expect(container).toMatchSnapshot();
    });
    it("doesn't re-expand an expanded card", () => {
      const { container, getByText } = render(
        <ExpandableCard.List items={items} />
      );

      fireEvent.click(getByText("Lorem Ipsum 0"));

      expect(container).toMatchSnapshot();
    });
    it("closes the opened card", () => {
      const closeLabel = "Close me";
      const { container, getByLabelText } = render(
        <ExpandableCard.List
          items={[
            {
              icon: BuildIcon,
              title: "Lorem ipsum",
              body: "Sit dolor amet",
              closeLabel: closeLabel,
              isExpanded: true
            },
            ...items
          ]}
        />
      );

      fireEvent.click(getByLabelText(closeLabel));

      expect(container).toMatchSnapshot();
    });
  });
});
