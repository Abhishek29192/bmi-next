import UserIcon from "@material-ui/icons/Person";
import { fireEvent } from "@testing-library/react";
import React from "react";
import Typography from "../../typography/Typography";
import { renderWithThemeProvider } from "../../__tests__/helper";
import TileList from "../TileList";

describe("TileList component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <TileList>
        <TileList.Item icon={UserIcon}>
          <Typography>Text 1</Typography>
        </TileList.Item>
        <TileList.Item icon={UserIcon}>
          <Typography>Text 2</Typography>
        </TileList.Item>
      </TileList>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with pagination", () => {
    const { container } = renderWithThemeProvider(
      <TileList isPaginated itemsPerPage={2}>
        <TileList.Item icon={UserIcon}>
          <Typography>Text 1</Typography>
        </TileList.Item>
        <TileList.Item icon={UserIcon}>
          <Typography>Text 2</Typography>
        </TileList.Item>
        <TileList.Item icon={UserIcon}>
          <Typography>Text 2</Typography>
        </TileList.Item>
      </TileList>
    );
    expect(container).toMatchSnapshot();
  });
  it("shows more tiles on 'Show more' click", () => {
    const { container, getByRole } = renderWithThemeProvider(
      <TileList isPaginated itemsPerPage={2}>
        <TileList.Item icon={UserIcon}>
          <Typography>Text 1</Typography>
        </TileList.Item>
        <TileList.Item icon={UserIcon}>
          <Typography>Text 2</Typography>
        </TileList.Item>
        <TileList.Item icon={UserIcon}>
          <Typography>Text 3</Typography>
        </TileList.Item>
      </TileList>
    );
    fireEvent.click(getByRole("button"));
    expect(container).toMatchSnapshot();
  });
  it("render correctly when onClick is defined", () => {
    const onClick = jest.fn();
    const { container, getByText } = renderWithThemeProvider(
      <TileList.Item icon={UserIcon} onClick={onClick}>
        <Typography>Text 1</Typography>
      </TileList.Item>
    );
    expect(container).toMatchSnapshot();
    expect(
      container.querySelectorAll("[class*=TileList-clickable]").length
    ).toBe(1);
    fireEvent.click(getByText("Text 1"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
