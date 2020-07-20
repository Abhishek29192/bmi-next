import React from "react";
import TileList from "../";
import { render, fireEvent } from "@testing-library/react";
import Typography from "@bmi/typography";
import UserIcon from "@material-ui/icons/Person";

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
    expect(container.firstChild).toMatchSnapshot();
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
    expect(container.firstChild).toMatchSnapshot();
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
    expect(container.firstChild).toMatchSnapshot();
  });
});
