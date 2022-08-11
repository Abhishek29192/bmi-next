import React from "react";
import {
  screen,
  renderWithI18NProvider,
  within,
  fireEvent,
  waitFor
} from "../../../../lib/tests/utils";
import { DefaultTable } from "../";

const mockMediaQuery = jest.fn().mockReturnValue(false);
jest.mock("@material-ui/core", () => {
  const original = jest.requireActual("@material-ui/core");
  return {
    ...original,
    useMediaQuery: () => mockMediaQuery()
  };
});

describe("default Table", () => {
  const item = (values = {}) => ({
    test: "test value",
    ...values
  });

  const reference = "test";

  it("render correctly", () => {
    renderWithI18NProvider(
      <DefaultTable
        items={[item()]}
        tableReference={reference}
        enablePagination={true}
        count={1}
      />
    );

    expect(screen.getByTestId(`${reference}-table-title-0`)).toHaveTextContent(
      "test"
    );
    expect(
      screen.getByTestId(`${reference}-table-row-0-item-0`)
    ).toHaveTextContent("test value");
    expect(screen.getByTestId("default-table-pagination")).toBeTruthy();
  });

  it("render multiple columns correctly", () => {
    renderWithI18NProvider(
      <DefaultTable
        items={[item({ test2: "test2 value" })]}
        tableReference={reference}
        enablePagination={true}
        count={1}
      />
    );

    expect(screen.getByTestId(`${reference}-table-title-1`)).toHaveTextContent(
      "test2"
    );
    expect(
      screen.getByTestId(`${reference}-table-row-0-item-1`)
    ).toHaveTextContent("test2 value");
  });

  it("render multiple rows correctly", () => {
    renderWithI18NProvider(
      <DefaultTable
        items={[item(), item({ test: "test2 value" })]}
        tableReference={reference}
        enablePagination={true}
        count={2}
      />
    );

    expect(
      screen.getByTestId(`${reference}-table-row-1-item-0`)
    ).toHaveTextContent("test2 value");
  });

  it("Paginated base on count", async () => {
    renderWithI18NProvider(
      <DefaultTable
        items={[
          item(),
          item({ test: "test value 2" }),
          item({ test: "test value 3" })
        ]}
        tableReference={reference}
        enablePagination={true}
        count={2}
      />
    );

    expect(screen.queryByTestId(`${reference}-table-row-0`)).toBeTruthy();
    expect(screen.queryByTestId(`${reference}-table-row-1`)).toBeTruthy();
    expect(screen.queryByTestId(`${reference}-table-row-2`)).toBeFalsy();

    const button = within(
      screen.queryByTestId("default-table-pagination")
    ).queryByText(2);
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByTestId(`${reference}-table-row-0-item-0`)
      ).toHaveTextContent("test value 3");
    });
  });

  it("hide pagination", () => {
    renderWithI18NProvider(
      <DefaultTable
        items={[item()]}
        tableReference={reference}
        enablePagination={false}
        count={1}
      />
    );

    expect(screen.queryByTestId("default-table-pagination")).toBeFalsy();
  });

  describe("mobeil view", () => {
    it("show list view", () => {
      mockMediaQuery.mockReturnValueOnce(true);
      renderWithI18NProvider(
        <DefaultTable
          items={[item()]}
          tableReference={reference}
          enablePagination={true}
          count={1}
        />
      );

      expect(screen.queryByTestId(`${reference}-list-view-0`)).toBeTruthy();
      expect(screen.queryByTestId(`${reference}-table-title-0`)).toBeFalsy();
      expect(
        screen.queryByTestId(`${reference}-list-view-0`)
      ).toHaveTextContent("test");
      expect(
        screen.queryByTestId(`${reference}-list-view-0`)
      ).toHaveTextContent("test value");
      expect(screen.getByTestId("default-table-pagination")).toBeTruthy();
    });

    it("render multiple list contents correctly", () => {
      mockMediaQuery.mockReturnValueOnce(true);
      renderWithI18NProvider(
        <DefaultTable
          items={[item({ test2: "test2 value" })]}
          tableReference={reference}
          enablePagination={true}
          count={1}
        />
      );

      expect(screen.getByTestId(`${reference}-list-view-0`)).toHaveTextContent(
        "test2"
      );
      expect(screen.getByTestId(`${reference}-list-view-0`)).toHaveTextContent(
        "test2 value"
      );
    });

    it("render multiple lists correctly", () => {
      mockMediaQuery.mockReturnValueOnce(true);
      renderWithI18NProvider(
        <DefaultTable
          items={[item(), item({ test: "test2 value" })]}
          tableReference={reference}
          enablePagination={true}
          count={2}
        />
      );

      expect(screen.getByTestId(`${reference}-list-view-1`)).toHaveTextContent(
        "test"
      );
      expect(screen.getByTestId(`${reference}-list-view-1`)).toHaveTextContent(
        "test2 value"
      );
    });
  });
});
