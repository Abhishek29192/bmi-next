import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Typography from "@bmi-digital/components/typography";
import UserIcon from "@material-ui/icons/Person";
import TileList from "../";

describe("TileList component", () => {
  it("renders correctly", () => {
    const { container } = render(
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
    const { container } = render(
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
    const { container, getByRole } = render(
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
    const { container, getByText } = render(
      <TileList.Item icon={UserIcon} onClick={onClick}>
        <Typography>Text 1</Typography>
      </TileList.Item>
    );
    expect(container).toMatchSnapshot();
    expect(container.getElementsByClassName("Tile--clickable").length).toBe(1);
    fireEvent.click(getByText("Text 1"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
