import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent } from "@testing-library/react";
import { MediaGallery } from "../";
import { GalleryItem } from "../../../lib/media/types";
import { renderWithI18NProvider } from "../../../lib/tests/utils";

const activeItem: GalleryItem = {
  type: "pdf",
  id: "0",
  url: "",
  title: "test-title",
  description: "test-description",
  fileUrl: "test-fileUrl.pdf"
};

const galleryItemTypeImage: GalleryItem = {
  type: "image",
  id: "1",
  url: "test-fileUrl.jpg",
  title: "test-title-2",
  description: "test-description-2",
  fileUrl: "test-fileUrl.jpg"
};

const galleryItemTypeVimeo: GalleryItem = {
  type: "vimeo",
  id: "1",
  url: "test-videolink",
  title: "test-title-3",
  description: "test-description-3",
  fileUrl: ""
};

const initialProps = {
  isOpen: true,
  onClose: jest.fn(),
  activeItem,
  items: [activeItem]
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe("MediaGallery", () => {
  it("should render component", () => {
    const { container, getByTestId } = renderWithI18NProvider(
      <MediaGallery {...initialProps} />
    );

    expect(container.parentElement).toMatchSnapshot();
    expect(container.parentElement.getElementsByClassName("slide").length).toBe(
      1
    );
    expect(getByTestId("carousel")).toBeTruthy();
    expect(getByTestId("download-button")).toBeTruthy();
  });

  describe("should preview as", () => {
    it("url if any", () => {
      const items = [galleryItemTypeImage];
      const {
        container: { parentElement },
        getByTestId
      } = renderWithI18NProvider(
        <MediaGallery {...initialProps} items={items} />
      );

      expect(parentElement).toMatchSnapshot();
      expect(parentElement.getElementsByClassName("slide").length).toBe(1);
      expect(getByTestId("carousel")).toBeTruthy();
      expect(
        parentElement.getElementsByClassName("image")[0].getAttribute("src")
      ).toBe(galleryItemTypeImage.url);
    });

    it("bmi icon if url is empty", () => {
      const { container, getAllByTestId } = renderWithI18NProvider(
        <MediaGallery {...initialProps} />
      );

      expect(container.parentElement).toMatchSnapshot();
      expect(
        container.parentElement.getElementsByClassName("slide").length
      ).toBe(1);
      expect(getAllByTestId("carousel")).toBeTruthy();
      expect(getAllByTestId("bmi-icon")).toBeTruthy();
    });

    it("vimeo if type vimeo", () => {
      const items = [galleryItemTypeVimeo];
      const {
        container: { parentElement },
        getAllByTestId
      } = renderWithI18NProvider(
        <MediaGallery {...initialProps} items={items} />
      );

      expect(parentElement).toMatchSnapshot();
      expect(parentElement.getElementsByClassName("slide").length).toBe(1);
      expect(getAllByTestId("carousel")).toBeTruthy();
      expect(parentElement.getElementsByTagName("iframe").length).toBe(1);
    });
  });

  it("should download fileUrl", async () => {
    const items = [galleryItemTypeImage];
    const {
      container: { parentElement },
      getByTestId
    } = renderWithI18NProvider(
      <MediaGallery {...initialProps} items={items} />
    );

    const downloadButton = getByTestId("download-button");
    const spyClickEvent = jest.fn();
    const mockCreateElement = document.createElement("a");
    jest
      .spyOn(mockCreateElement, "click")
      .mockImplementation(() => spyClickEvent());
    const test = jest
      .spyOn(document, "createElement")
      .mockImplementation(() => mockCreateElement);

    expect(parentElement).toMatchSnapshot();
    expect(parentElement.getElementsByClassName("slide").length).toBe(1);
    expect(getByTestId("carousel")).toBeTruthy();
    expect(downloadButton).toBeTruthy();

    fireEvent.click(downloadButton);

    expect(test).toHaveBeenCalledTimes(1);
    expect(mockCreateElement.href).toBe(
      `http://localhost/${galleryItemTypeImage.fileUrl}`
    );
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
