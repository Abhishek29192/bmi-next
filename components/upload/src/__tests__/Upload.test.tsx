import React from "react";
import Upload from "../";
import { render, fireEvent } from "@testing-library/react";

describe("Upload component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Upload id="default-upload" buttonLabel="Choose files" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with description", () => {
    const { container } = render(
      <Upload
        id="upload-with-description"
        buttonLabel="Upload"
        instructions="Please upload your images here"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with restricted file types", () => {
    const { container } = render(
      <Upload id="restricted-upload" buttonLabel="Upload" accept="image/*" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("handles file change event", () => {
    const { container, getByLabelText } = render(
      <Upload id="onchange-handler-upload" buttonLabel="Upload" />
    );
    const inputEl = getByLabelText("Upload");
    // eslint-disable-next-line no-undef
    const file = new File(["content"], "filename.png", {
      type: "image/png"
    });

    Object.defineProperty(inputEl, "files", {
      value: [file]
    });

    fireEvent.change(inputEl);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("onChange handler is called", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <Upload
        id="onchange-mock-upload"
        buttonLabel="Upload here"
        handleUpload={onChange}
      />
    );
    const input = getByLabelText("Upload here");
    fireEvent.change(input);
    expect(onChange.mock.calls).toMatchSnapshot();
  });
});
