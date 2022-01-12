import React from "react";
import { render } from "@testing-library/react";
import * as all from "@bmi/use-dimensions";
import Table from "../";
import { TableProps } from "../Table";

function getDimensionHookFn(width: number): () => all.UseDimensionsHook {
  return () => [() => {}, { width, height: 0 }, document.createElement("div")];
}

function mockUseDimensions({
  containerWidth,
  normalTableWidth,
  mediumTableWidth
}: {
  containerWidth: number;
  normalTableWidth: number;
  mediumTableWidth: number;
}) {
  let spy = jest.spyOn(all, "default");

  // NOTE: component re-renders at most three times in the test for three different size
  for (let i = 0; i < 3; i++) {
    spy = spy
      .mockImplementationOnce(getDimensionHookFn(containerWidth))
      .mockImplementationOnce(getDimensionHookFn(normalTableWidth))
      .mockImplementationOnce(getDimensionHookFn(mediumTableWidth));
  }
}

afterEach(() => {
  jest.restoreAllMocks();
});

const ExampleTable = (props: TableProps) => (
  <Table {...props}>
    <Table.Head>
      <Table.Row>
        <Table.Cell>Head Row - Cell 1</Table.Cell>
        <Table.Cell>Head Row - Cell 2</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Row 1 - Cell 1</Table.Cell>
        <Table.Cell>Row 1 - Cell 2</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Row 2 - Cell 1</Table.Cell>
        <Table.Cell>Row 2 - Cell 2</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

describe("Table component", () => {
  it("renders correctly", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 400,
      mediumTableWidth: 400
    });
    const { container } = render(<ExampleTable />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly without width", () => {
    const { container } = render(<ExampleTable />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders table head with different ColorPair", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 400,
      mediumTableWidth: 400
    });
    const { container } = render(<ExampleTable theme="blue-900" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with reduced size - fixed two columns if normal table is too big to contain", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 400
    });
    const { container } = render(<ExampleTable />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders medium table with no border", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 400
    });
    const { container } = render(<ExampleTable hasNoBorder />);
    expect(container.firstChild).toMatchSnapshot();
    expect(container.getElementsByClassName("Table--no-border").length).toBe(1);
  });
  it("renders small table with no border", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 400,
      mediumTableWidth: 401
    });
    const { container } = render(<ExampleTable hasNoBorder />);
    expect(container.firstChild).toMatchSnapshot();
    expect(
      container.getElementsByClassName("SmallTable--no-border").length
    ).toBe(1);
  });

  it("without header renders with reduced size - list view even if there is enough space", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 400
    });
    const { container } = render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row 1 - Cell 1</Table.Cell>
            <Table.Cell>Row 1 - Cell 2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Row 2 - Cell 1</Table.Cell>
            <Table.Cell>Row 2 - Cell 2</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with reduced size - list view if both normal and medium table are too big to contain", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 401
    });
    const { container } = render(<ExampleTable />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders without striped rows", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 400
    });
    const { container } = render(
      <Table rowBgColorPattern="none">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row 1 - Cell 1</Table.Cell>
            <Table.Cell>Row 1 - Cell 2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Row 2 - Cell 1</Table.Cell>
            <Table.Cell>Row 2 - Cell 2</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders without TableBody", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 400
    });
    const { container } = render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Head Row - Cell 1</Table.Cell>
            <Table.Cell>Head Row - Cell 2</Table.Cell>
          </Table.Row>
        </Table.Head>
      </Table>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("throws error if header has no children", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 400
    });
    try {
      render(
        <Table>
          <Table.Head>{null}</Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Row 1 - Cell 1</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });

  it("throws error if header children not an element", () => {
    mockUseDimensions({
      containerWidth: 400,
      normalTableWidth: 401,
      mediumTableWidth: 400
    });
    try {
      render(
        <Table>
          <Table.Head>Head</Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Row 1 - Cell 1</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});
