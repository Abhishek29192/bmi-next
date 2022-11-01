import React from "react";
import axios from "axios";
import FileComponent from "../_File";
import { renderWithThemeProvider } from "../../__tests__/helper";

jest.mock("axios");

const uri = "abc";
const mapBody = jest.fn();
const onDeleteClick = jest.fn();
const onRequestSuccess = jest.fn();

const initialCreateObjectURL = window.URL.createObjectURL;
const initialRevokeObjectURL = window.URL.revokeObjectURL;

window.URL.createObjectURL = jest.fn().mockReturnValue("url");
window.URL.revokeObjectURL = jest.fn();

const createFile = (file?: Partial<File>): File => ({
  name: "something",
  type: "file/docx",
  size: 123,
  lastModified: 123,
  webkitRelativePath: "",
  arrayBuffer: jest.fn(),
  slice: jest.fn(),
  stream: jest.fn(),
  text: jest.fn(),
  ...file
});

describe("Upload component", () => {
  afterAll(() => {
    window.URL.createObjectURL = initialCreateObjectURL;
    window.URL.revokeObjectURL = initialRevokeObjectURL;
  });

  it("renders correctly", async () => {
    const { container } = renderWithThemeProvider(
      <FileComponent
        file={createFile()}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should execute api request with headers", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "x"
        }
      }
    });

    axios.CancelToken.source = jest.fn().mockReturnValue({
      token: "this",
      cancel: () => {}
    });
    const file = createFile();

    const headers = {
      "access-control-allow-origin": "*",
      "content-type": "image/gif"
    };

    renderWithThemeProvider(
      <FileComponent
        file={file}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
        headers={headers}
      />
    );
    expect(axios.post).toHaveBeenCalledWith(uri, mapBody(file), {
      cancelToken: "this",
      headers
    });
  });

  it("sholud execute default source.cancel function", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "x"
        }
      }
    });

    axios.CancelToken.source = jest.fn().mockReturnValue({ token: "this" });

    renderWithThemeProvider(
      <FileComponent
        file={createFile()}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
      />
    );
    expect(axios.post).toHaveBeenCalled();
  });

  it("sholud catch request error", async () => {
    axios.post = jest.fn().mockImplementation(() =>
      Promise.reject({
        data: {
          sys: {
            type: "Error"
          }
        }
      })
    );

    axios.CancelToken.source = jest.fn().mockReturnValue({
      token: "this",
      cancel: () => {}
    });

    renderWithThemeProvider(
      <FileComponent
        file={createFile()}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
      />
    );
    expect(axios.post).toHaveBeenCalled();
  });

  it("renders correctly and should not call axios.post if validation error appears", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "x"
        }
      }
    });

    axios.CancelToken.source = jest.fn().mockReturnValue({
      token: "this",
      cancel: () => {}
    });

    const validation = () => "valid";

    renderWithThemeProvider(
      <FileComponent
        file={createFile()}
        validation={validation}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
      />
    );
    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it("should call onRequest function if it is populated", async () => {
    const onRequest = jest.fn();

    renderWithThemeProvider(
      <FileComponent
        file={createFile()}
        onRequest={onRequest}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
      />
    );
    expect(onRequest).toHaveBeenCalledTimes(1);
  });

  it("renders correctly with large file size", async () => {
    const { container } = renderWithThemeProvider(
      <FileComponent
        file={createFile({ type: "image/png", size: 12345593094 })}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly if an error recieved in API response", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "Error"
        }
      }
    });

    axios.CancelToken.source = jest.fn().mockReturnValue({
      token: "this",
      cancel: () => {}
    });

    const { container } = renderWithThemeProvider(
      <FileComponent
        file={createFile({ type: "pdf" })}
        uri="https://run.mocky.io/v3/c5a04537-f12b-4fa4-82ea-71711db77ffb"
        mapBody={mapBody}
        onDeleteClick={jest.fn()}
        onRequestSuccess={jest.fn()}
        errorMessage="Upload failed"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
