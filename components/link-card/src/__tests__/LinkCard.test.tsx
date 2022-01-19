import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { useState } from "react";
import LinkCard from "../";

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
    const { container } = render(<LinkCard title="test">test</LinkCard>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders on open variant", () => {
    const { container } = render(
      <LinkCard isOpen title="test">
        test
      </LinkCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("onCloseClick for item", () => {
    const onCloseClick = jest.fn();
    const { container } = render(
      <LinkCard isOpen title="test" onCloseClick={onCloseClick}>
        content
      </LinkCard>
    );
    const item = container.getElementsByClassName("item")[0];
    fireEvent.click(item);
    expect(onCloseClick).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("onCloseClick for icon", () => {
    const onCloseClick = jest.fn();
    const { container } = render(
      <LinkCard isOpen title="test" onCloseClick={onCloseClick}>
        content
      </LinkCard>
    );
    const icon = container.getElementsByClassName("icon")[0].firstChild;
    fireEvent.click(icon);
    expect(onCloseClick).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders onEnterd transition onClick ", async () => {
    const onExpandCompleted = jest.fn();
    const { container, getAllByText } = render(
      <LinkCardWithTransition onExpandCompleted={onExpandCompleted} />
    );
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getAllByText("test")[0]);
    expect(container.firstChild).toMatchSnapshot();
    await waitFor(() => {
      expect(onExpandCompleted).toHaveBeenCalledTimes(1);
    });
  });
});
