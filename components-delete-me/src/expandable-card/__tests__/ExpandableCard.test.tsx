import { act, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React, { Dispatch } from "react";
import BuildIcon from "test.svg";
import { renderWithThemeProvider } from "../../__tests__/helper";
import ExpandableCard from "../ExpandableCard";

afterEach(cleanup);

describe("ExpandableCard component", () => {
  const props = {
    icon: BuildIcon,
    title: "Title",
    body: "Body"
  };

  const transitionEndEvent = new Event("transitionend", {
    bubbles: true,
    cancelable: false
  });

  it("Should render the ExpandedCard expanded", () => {
    const container = renderWithThemeProvider(
      <ExpandableCard {...props} isExpanded />
    );
    expect(container).toMatchSnapshot();
  });

  it("Should render the ExpandedCard not expanded", () => {
    const container = renderWithThemeProvider(<ExpandableCard {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should render close button if the onCloseClick prop is provided", () => {
    const onCloseClickMock = jest.fn();
    const { getByRole, rerender, queryByRole } = renderWithThemeProvider(
      <ExpandableCard
        {...props}
        onCloseClick={onCloseClickMock}
        closeLabel="close"
      />
    );

    const closeButton = getByRole("button", { name: /close/i });

    expect(closeButton).toBeInTheDocument();

    rerender(<ExpandableCard {...props} />);

    const noCloseButton = queryByRole("button", { name: /close/i });

    expect(noCloseButton).not.toBeInTheDocument();
  });

  it("should render ExpandableCard with footer if the footer prop is provided", () => {
    const { getByText, rerender, queryByText } = renderWithThemeProvider(
      <ExpandableCard {...props} footer="Test Footer" />
    );
    const footer = getByText(/test footer/i);

    expect(footer).toBeInTheDocument();

    rerender(<ExpandableCard {...props} />);

    const noFooter = queryByText(/test footer/i);

    expect(noFooter).not.toBeInTheDocument();
  });

  it("should call onClick on a Card click", async () => {
    const onClickMock = jest.fn();

    const { getByRole } = renderWithThemeProvider(
      <ExpandableCard {...props} onClick={onClickMock} />
    );

    const card = getByRole("button", { name: /title/i });

    fireEvent.click(card);

    expect(onClickMock).toBeCalled();
  });

  it("should call onCloseClick on a close button click", async () => {
    const onCloseClickMock = jest.fn();

    const { getByRole } = renderWithThemeProvider(
      <ExpandableCard
        {...props}
        onCloseClick={onCloseClickMock}
        closeLabel="close"
      />
    );

    const closeButton = getByRole("button", { name: /close/i });

    fireEvent.click(closeButton);

    expect(onCloseClickMock).toBeCalled();
  });

  it("it expands the card when changing isExpanded", () => {
    const { container, rerender, getByText } = renderWithThemeProvider(
      <ExpandableCard {...props} isExpanded={false} />
    );

    rerender(<ExpandableCard {...props} isExpanded />);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    transitionEndEvent.propertyName = "height";
    fireEvent(getByText(props.title), transitionEndEvent);

    expect(container).toMatchSnapshot();

    rerender(<ExpandableCard {...props} isExpanded={false} />);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    transitionEndEvent.propertyName = "height";
    fireEvent(getByText(props.title), transitionEndEvent);

    expect(container).toMatchSnapshot();
  });

  it("it triggers an onAnimationEnd event", () => {
    const onAnimationEnd = jest.fn();

    const { rerender, getByText } = renderWithThemeProvider(
      <ExpandableCard
        {...props}
        isExpanded={false}
        onAnimationEnd={onAnimationEnd}
      />
    );

    rerender(
      <ExpandableCard {...props} isExpanded onAnimationEnd={onAnimationEnd} />
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    transitionEndEvent.propertyName = "height";
    fireEvent(getByText(props.title), transitionEndEvent);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    transitionEndEvent.propertyName = "width";
    fireEvent(getByText(props.title), transitionEndEvent);

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
      const { container } = renderWithThemeProvider(
        <ExpandableCard.List
          items={items.filter(({ isExpanded }) => !isExpanded)}
        />
      );

      expect(container).toMatchSnapshot();
    });

    it("renders with one card expanded", () => {
      const { container } = renderWithThemeProvider(
        <ExpandableCard.List items={items} />
      );

      expect(container).toMatchSnapshot();
    });

    it("handles multiple cards expanded by default", () => {
      const { container } = renderWithThemeProvider(
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
      const { container, getByText } = renderWithThemeProvider(
        <ExpandableCard.List items={items} />
      );

      fireEvent.click(getByText("Lorem Ipsum 1"));

      expect(container).toMatchSnapshot();
    });

    it("doesn't re-expand an expanded card", () => {
      const { container, getByText } = renderWithThemeProvider(
        <ExpandableCard.List items={items} />
      );

      fireEvent.click(getByText("Lorem Ipsum 0"));

      expect(container).toMatchSnapshot();
    });

    it("closes the opened card", () => {
      const closeLabel = "Close me";
      const { container, getByLabelText } = renderWithThemeProvider(
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

  it("should call onResize on a window resize and match snapshot", async () => {
    const setStateMock = jest.fn();
    const useStateMock = (useState: any) => [useState, setStateMock];
    jest
      .spyOn(React, "useState")
      .mockImplementation(useStateMock as () => [unknown, Dispatch<unknown>]);

    const container = renderWithThemeProvider(
      <ExpandableCard {...props} isExpanded />
    );

    act(() => {
      window.innerWidth = 500;
      fireEvent(window, new Event("resize"));
    });

    await waitFor(() => expect(setStateMock).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });
});
