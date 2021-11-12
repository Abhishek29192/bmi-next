import React from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import FileComponent from "../_File";

jest.mock("axios");

const uri = "abc";
const mapBody = jest.fn();
const onDeleteClick = jest.fn();
const onRequestSuccess = jest.fn();

const initialCreateObjectURL = window.URL.createObjectURL;
const initialRevokeObjectURL = window.URL.revokeObjectURL;

window.URL.createObjectURL = jest.fn().mockReturnValue("url");
window.URL.revokeObjectURL = jest.fn();

describe("Upload component", () => {
  afterAll(() => {
    window.URL.createObjectURL = initialCreateObjectURL;
    window.URL.revokeObjectURL = initialRevokeObjectURL;
  });

  it("renders correctly", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "x"
        }
      }
    });

    axios.CancelToken.source = jest
      .fn()
      .mockReturnValue({ token: "this", cancel: () => {} });

    const { container } = render(
      <FileComponent
        file={{
          name: "something",
          type: "file/docx",
          size: 123,
          lastModified: 123,
          arrayBuffer: jest.fn(),
          slice: jest.fn(),
          stream: jest.fn(),
          text: jest.fn()
        }}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
      />
    );
    expect(axios.post).toHaveBeenCalled();
    expect(await waitFor(() => container.firstChild)).toMatchSnapshot();
  });

  it("renders correctly with large file size", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "x"
        }
      }
    });

    axios.CancelToken.source = jest
      .fn()
      .mockReturnValue({ token: "this", cancel: () => {} });

    const { container } = render(
      <FileComponent
        file={{
          name: "something",
          type: "image/png",
          size: 12345593094,
          lastModified: 123,
          arrayBuffer: jest.fn(),
          slice: jest.fn(),
          stream: jest.fn(),
          text: jest.fn()
        }}
        uri={uri}
        mapBody={mapBody}
        onDeleteClick={onDeleteClick}
        onRequestSuccess={onRequestSuccess}
        errorMessage={"Upload failed"}
      />
    );
    expect(axios.post).toHaveBeenCalled();
    expect(await waitFor(() => container.firstChild)).toMatchSnapshot();
  });
  it("renders correctly with error", async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        sys: {
          type: "Error"
        }
      }
    });

    axios.CancelToken.source = jest
      .fn()
      .mockReturnValue({ token: "this", cancel: () => {} });

    const { container } = render(
      <FileComponent
        file={{
          name: "something",
          type: "pdf",
          size: 123,
          lastModified: 123,
          arrayBuffer: jest.fn(),
          slice: jest.fn(),
          stream: jest.fn(),
          text: jest.fn()
        }}
        uri="https://run.mocky.io/v3/c5a04537-f12b-4fa4-82ea-71711db77ffb"
        mapBody={mapBody}
        onDeleteClick={jest.fn()}
        onRequestSuccess={jest.fn()}
        errorMessage="Upload failed"
      />
    );
    expect(await waitFor(() => container.firstChild)).toMatchSnapshot();
  });
});
