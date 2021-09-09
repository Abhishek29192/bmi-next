import React from "react";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import axios from "axios";
import Upload from "../";

jest.mock("axios");

afterEach(cleanup);

const uri = "xyz";
const mapBody = jest.fn();
const mapValue = jest.fn();

const initialCreateObjectURL = window.URL.createObjectURL;
const initialRevokeObjectURL = window.URL.revokeObjectURL;
const initialMatchMedia = window.matchMedia;

window.URL.createObjectURL = jest.fn().mockReturnValue("url");
window.URL.revokeObjectURL = jest.fn();

function createMatchMedia(width?: unknown) {
  return (query: string) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {}
  });
}

describe("Upload component", () => {
  afterAll(() => {
    window.URL.createObjectURL = initialCreateObjectURL;
    window.URL.revokeObjectURL = initialRevokeObjectURL;
    window.matchMedia = initialMatchMedia;
  });
  afterEach(cleanup);
  it("renders correctly", () => {
    const { container } = render(
      <Upload
        id="default-upload"
        name="default-upload"
        uri={uri}
        mapBody={mapBody}
        mapValue={mapValue}
        microcopyProvider={{ test: "test" }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with error", () => {
    const { container } = render(
      <Upload
        id="default-upload"
        name="default-upload"
        uri={uri}
        mapBody={mapBody}
        mapValue={mapValue}
        getValidationError={(_) => "This error is always displayed"}
        microcopyProvider={{ test: "test" }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with buttonLabel", () => {
    const { container } = render(
      <Upload
        id="default-upload"
        name="default-upload"
        buttonLabel="Choose files"
        uri={uri}
        mapBody={mapBody}
        mapValue={mapValue}
        microcopyProvider={{ test: "test" }}
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
        uri={uri}
        mapBody={mapBody}
        mapValue={mapValue}
        microcopyProvider={{ test: "test" }}
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
        accept=".png,.pdf"
        uri={uri}
        mapBody={mapBody}
        mapValue={mapValue}
        microcopyProvider={{ test: "test" }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("onChange handler is called", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "file"
        }
      }
    });

    axios.CancelToken.source = jest
      .fn()
      .mockReturnValue({ token: "this", cancel: () => {} });

    const onChange = jest.fn();
    const { getByTestId, container } = render(
      <Upload
        id="onchange-mock-upload"
        name="onchange-mock-upload"
        buttonLabel="Upload here"
        uri={uri}
        mapBody={mapBody}
        mapValue={mapValue}
        onChange={onChange}
        microcopyProvider={{ test: "test" }}
      />
    );
    const input = getByTestId("onchange-mock-upload");

    fireEvent.change(input, {
      target: {
        files: [new File([], "name", { type: "image" })]
      }
    });

    const deleteButton = await waitFor(() => getByTestId("file-delete"));

    fireEvent.click(deleteButton);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("onChange handler is called on file drop", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "file"
        }
      }
    });

    axios.CancelToken.source = jest
      .fn()
      .mockReturnValue({ token: "this", cancel: () => {} });

    const onChange = jest.fn();
    const id = "drop-upload";
    const buttonLabel = "Upload here";

    // @ts-ignore Only used for testing.
    window.matchMedia = createMatchMedia(1280);

    const { getByTestId, getByText } = render(
      <Upload
        id={id}
        name={id}
        buttonLabel={buttonLabel}
        uri={uri}
        mapBody={mapBody}
        mapValue={mapValue}
        onChange={onChange}
        microcopyProvider={{ test: "test" }}
      />
    );

    const accordionLabel = getByText(buttonLabel);

    fireEvent.click(accordionLabel);

    const dropZone = getByTestId(`drop-zone-${id}`);

    fireEvent.dragEnter(dropZone);
    fireEvent.dragOver(dropZone);
    fireEvent.dragLeave(dropZone);

    let file: DataTransferItem = {
      kind: "file",
      getAsFile: () => new File([], "example"),
      getAsString: jest.fn(),
      webkitGetAsEntry: jest.fn(),
      type: "file"
    };
    fireEvent.drop(dropZone, {
      dataTransfer: {
        items: {
          0: file,
          length: 1
        }
      }
    });
    expect(await waitFor(() => onChange.mock.calls)).toMatchSnapshot();
  });
  it("renders correctly on mobile", () => {
    // @ts-ignore Only used for testing.
    window.matchMedia = createMatchMedia(500);

    const { container } = render(
      <Upload
        id="mobile-upload"
        name="mobile-upload"
        buttonLabel="Upload here"
        uri={uri}
        mapBody={mapBody}
        mapValue={mapValue}
        microcopyProvider={{ test: "test" }}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("onFilesChange handler is called", async () => {
    const onFilesChange = jest.fn((files) => {});
    const { getByTestId } = render(
      <Upload
        id="onFilesChange-mock-upload"
        name="onFilesChange-mock-upload"
        buttonLabel="Upload here"
        mapBody={mapBody}
        mapValue={mapValue}
        microcopyProvider={{ test: "test" }}
        onFilesChange={onFilesChange}
      />
    );
    const input = getByTestId("onFilesChange-mock-upload");

    const files = [new File([], "name", { type: "image" })];
    fireEvent.change(input, {
      target: {
        files
      }
    });

    expect(onFilesChange).toHaveBeenCalledWith(files);
  });

  it("render correctly with value", async () => {
    const { getAllByTestId } = render(
      <Upload
        id="onFilesChange-mock-upload"
        name="onFilesChange-mock-upload"
        buttonLabel="Upload here"
        mapBody={mapBody}
        mapValue={mapValue}
        microcopyProvider={{ test: "test" }}
        value={[
          new File([], "file1", { type: "image" }),
          new File([], "file2", { type: "image" })
        ]}
      />
    );
    expect(getAllByTestId("test-file")).toHaveLength(2);
  });
});
