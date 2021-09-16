import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import UserIcon from "@material-ui/icons/Person";
import Button from "../";

afterEach(cleanup);
describe("Button component", () => {
  it("renders correctly", () => {
    const { container } = render(<Button>Caption</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders an outlined button on dark background", () => {
    const { container } = render(
      <Button hasDarkBackground variant="outlined">
        Caption
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders an opaque outlined button on dark background", () => {
    const { container } = render(
      <Button variant="opaqueOutlined">Caption</Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a flat button on dark background", () => {
    const { container } = render(
      <Button hasDarkBackground variant="text">
        Caption
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders an icon button", () => {
    const { container } = render(
      <Button isIconButton accessibilityLabel="User">
        Caption
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a small icon button", () => {
    const { container } = render(
      <Button isIconButton accessibilityLabel="UserIcon" size="small">
        <UserIcon />
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a disabled icon button", () => {
    const { container } = render(
      <Button isIconButton disabled accessibilityLabel="UserIcon">
        <UserIcon />
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("calls onClick function when clicked", () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <Button
        isIconButton
        accessibilityLabel="User"
        data-testid="button-click-test"
        onClick={onClick}
      >
        <UserIcon />
      </Button>
    );
    const button = getByTestId("button-click-test");
    fireEvent.click(button);
    expect(onClick.mock.calls.length).toBe(1);
  });
});
