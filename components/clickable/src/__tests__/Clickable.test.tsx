import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Clickable, { withClickable } from "../";

const consoleError = console.error;

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = consoleError;
});

afterEach(cleanup);

describe("Clickable component", () => {
  it("renders correctly", () => {
    const { container } = render(<Clickable>Hit me</Clickable>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a default button", () => {
    const { container } = render(<Clickable model="default">Hit me</Clickable>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a submit button", () => {
    const { container } = render(<Clickable model="submit">Hit me</Clickable>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a reset button", () => {
    const { container } = render(<Clickable model="reset">Hit me</Clickable>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders an anchor link", () => {
    const { container } = render(
      <Clickable model="htmlLink" href="#">
        Hit me
      </Clickable>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a router link", () => {
    const RouterLink = () => null;
    const { container } = render(
      <Clickable model="routerLink" to="/" linkComponent={RouterLink}>
        Hit me
      </Clickable>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a with custom className", () => {
    const { container } = render(
      <Clickable className="test-class">Hit me</Clickable>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("triggers an onClick event", () => {
    const onClick = jest.fn();
    const text = "Hit me";
    const { getByText } = render(
      <Clickable onClick={onClick}>{text}</Clickable>
    );
    fireEvent.click(getByText(text));
    expect(onClick.mock.calls).toMatchSnapshot();
  });
  it("renders a component wrapped in withClickable", () => {
    const Component = ({
      children,
      to,
      component: Component
    }: {
      children: React.ReactNode;
      to: string;
      component: React.ElementType;
    }) => <Component to={to}>Custom wrapper: {children}</Component>;
    const RouterLink = (props: any) => <span {...props} />;
    const ClickableComponent = withClickable(Component);

    const { container } = render(
      <ClickableComponent model="routerLink" to="/" linkComponent={RouterLink}>
        Hit me
      </ClickableComponent>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});