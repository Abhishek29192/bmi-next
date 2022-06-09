import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithI18NProvider } from "../../../lib/tests/utils";
import ConfirmDialog from "../Dialog";

const onConfirm = jest.fn();
const onCancel = jest.fn();

describe("UserCard Dialog", () => {
  it("should render correctly", () => {
    const dialogState = {
      open: true,
      title: "Confirm title",
      text: "Confirm text",
      onConfirm: onConfirm
    };
    renderWithI18NProvider(
      <ConfirmDialog onCancel={onCancel} dialogState={dialogState} />
    );

    const confirmButton = screen.getByText("user_card.confirm");
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
