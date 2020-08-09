import React from "react";
import Upload from "../";
import { render, fireEvent } from "@testing-library/react";

describe("Upload component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Upload id="default-upload" name="default-upload" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with buttonLabel", () => {
    const { container } = render(
      <Upload
        id="default-upload"
        name="default-upload"
        buttonLabel="Choose files"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with description", () => {
    const { container } = render(
      <Upload
        id="upload-with-description"
        name="upload-with-description"
        buttonLabel="Upload"
        instructions="Please upload your images here"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with restricted file types", () => {
    const { container } = render(
      <Upload
        id="restricted-upload"
        name="restricted-upload"
        buttonLabel="Upload"
        accept="image/*"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("onChange handler is called", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <Upload
        id="onchange-mock-upload"
        name="onchange-mock-upload"
        buttonLabel="Upload here"
        onChange={onChange}
      />
    );
    const input = getByLabelText("Upload here");
    fireEvent.change(input, {
      target: { files: { 0: { name: "FileName.png" }, length: 1 } }
    });
    expect(onChange.mock.calls).toMatchSnapshot();
  });
  it("renders with error", () => {
    const { getByRole, container } = render(
      <Upload
        isRequired
        id="upload-with-error"
        name="upload-with-error"
        buttonLabel="Upload here"
      />
    );
    const button = getByRole("button");
    fireEvent.blur(button);
    expect(container.firstChild).toMatchSnapshot();
  });
});
