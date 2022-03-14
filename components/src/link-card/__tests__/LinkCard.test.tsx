import { fireEvent, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import LinkCard from "../LinkCard";

const LinkCardWithTransition = ({
  onExpandCompleted
}: {
  onExpandCompleted?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <LinkCard
      isOpen={isOpen}
      onClick={() => {
        setIsOpen(true);
      }}
      title="test"
      onCloseClick={() => {
        setIsOpen(false);
      }}
      onExpandCompleted={onExpandCompleted}
    >
      something
    </LinkCard>
  );
};

describe("LinkCard component", () => {
  it("renders correctly closed variant", () => {
    const { container } = renderWithThemeProvider(
      <LinkCard title="test">test</LinkCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders on open variant", () => {
    const { container } = renderWithThemeProvider(
      <LinkCard isOpen title="test">
        test
      </LinkCard>
    );
    expect(container).toMatchSnapshot();
  });
  it("onCloseClick for item", () => {
    const onCloseClick = jest.fn();
    const { container, getAllByTestId } = renderWithThemeProvider(
      <LinkCard isOpen title="test" onCloseClick={onCloseClick}>
        content
      </LinkCard>
    );
    const item = getAllByTestId("linkCard-item")[0];
    fireEvent.click(item);
    expect(onCloseClick).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it("renders onEnterd transition onClick ", async () => {
    const onExpandCompleted = jest.fn();
    const { container, getAllByText } = renderWithThemeProvider(
      <LinkCardWithTransition onExpandCompleted={onExpandCompleted} />
    );
    expect(container).toMatchSnapshot();
    fireEvent.click(getAllByText("test")[0]);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      expect(onExpandCompleted).toHaveBeenCalledTimes(1);
    });
  });
});
