import React from "react";
import { cleanup, fireEvent } from "@testing-library/react";
import mockConsole, { RestoreConsole } from "jest-mock-console";
import Clickable, { withClickable } from "../Clickable";
import { renderWithThemeProvider } from "../../__tests__/helper";

beforeAll(() => {
  mockConsole();
});

afterEach(cleanup);

describe("Clickable component", () => {
  let restoreConsole: RestoreConsole;

  beforeAll(() => {
    restoreConsole = mockConsole();
  });

  afterAll(() => {
    restoreConsole();
  });

  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Clickable>Hit me</Clickable>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a default button", () => {
    const { container } = renderWithThemeProvider(
      <Clickable model="default">Hit me</Clickable>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a submit button", () => {
    const { container } = renderWithThemeProvider(
      <Clickable model="submit">Hit me</Clickable>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a reset button", () => {
    const { container } = renderWithThemeProvider(
      <Clickable model="reset">Hit me</Clickable>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders an anchor link", () => {
    const { container } = renderWithThemeProvider(
      <Clickable model="htmlLink" href="#">
        Hit me
      </Clickable>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a router link", () => {
    const RouterLink = () => null;
    const { container } = renderWithThemeProvider(
      <Clickable model="routerLink" to="/" linkComponent={RouterLink}>
        Hit me
      </Clickable>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a download button", () => {
    const { container } = renderWithThemeProvider(
      <Clickable model="download" href="#" download="test-download">
        Hit me
      </Clickable>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a with custom className", () => {
    const { container } = renderWithThemeProvider(
      <Clickable className="test-class">Hit me</Clickable>
    );
    expect(container).toMatchSnapshot();
  });
  it("triggers an onClick event", () => {
    const onClick = jest.fn();
    const text = "Hit me";
    const { getByText } = renderWithThemeProvider(
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

    const { container } = renderWithThemeProvider(
      <ClickableComponent model="routerLink" to="/" linkComponent={RouterLink}>
        Hit me
      </ClickableComponent>
    );

    expect(container).toMatchSnapshot();
  });
});
