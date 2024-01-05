import { logoIconMap } from "@bmi-digital/components";
import { describe, it, jest } from "@jest/globals";
import { ReactElement } from "react";
import createSvgs from "../createSvgs";
import type React from "react";
import type { Attributes, FunctionComponent } from "react";

const mockExistsSync = jest.fn();
const mockRmSync = jest.fn();
const mockMkdirSync = jest.fn();
const mockWriteFileSync = jest.fn();
jest.mock("node:fs", () => ({
  existsSync: (path: string) => mockExistsSync(path),
  mkdirSync: (path: string) => mockMkdirSync(path),
  rmSync: (path: string) => mockRmSync(path),
  writeFileSync: (file: string, data: string) => mockWriteFileSync(file, data)
}));

const mockRenderToString = jest.fn();
jest.mock("react-dom/server", () => ({
  renderToString: (element: ReactElement) => mockRenderToString(element)
}));

const mockCreateElement = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual<typeof React>("react"),
  createElement: (
    type: FunctionComponent<unknown>,
    props?: Attributes | null
  ) => mockCreateElement(type, props)
}));

const outDir = `${__dirname.replace("/__tests__", "")}/../../public/brands`;

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("createSvgs", () => {
  it("should create SVGs for each logo when brands directory doesn't exist", () => {
    mockExistsSync.mockReturnValueOnce(false);
    const createdElement = {};
    mockCreateElement.mockReturnValue(createdElement);
    const svgAsString =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250"><path fill="#009fe3" d="M0 0h250v250H0z"></path><g fill="#fff"><path d="M155.393 86.416 144.565 131h-.212l-10.829-44.584H100.3v50.634c-.76-9.718-6.732-14.589-13.079-16.771 5.626-3.078 9.342-7.218 9.342-14.862 0-7.749-4.247-19-24.2-19H30.848v75.8h42.994c12.786 0 25.368-7.183 26.455-21.075v21.075h22.081V113.6h.212l13.164 48.62h17.41l13.163-48.62h.213v48.62h22.081v-75.8ZM54.2 104.461h12.317c4.777 0 7.962 1.381 7.962 5.2 0 4.884-3.079 6.264-7.962 6.264H54.2Zm13.694 39.7H54.2v-14.115h14.652c5.521 0 8.174 2.442 8.174 6.9 0 5.839-4.246 7.219-9.126 7.219ZM195.798 86.416h23.355v75.797h-23.355z"></path></g></svg>';
    mockRenderToString.mockReturnValue(svgAsString);

    createSvgs();

    expect(mockExistsSync).toHaveBeenCalledWith(outDir);
    expect(mockMkdirSync).toHaveBeenCalledWith(outDir);
    expect(mockWriteFileSync).toHaveBeenCalledTimes(
      Object.keys(logoIconMap).length
    );
    Object.entries(logoIconMap).forEach(([brandName, logo]) => {
      expect(mockCreateElement).toHaveBeenCalledWith(logo, {});
      expect(mockRenderToString).toHaveBeenCalledWith(createdElement);
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        `${outDir}/${brandName}.svg`,
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250"><path fill="#009fe3" d="M0 0h250v250H0z"/><g fill="#fff"><path d="M155.393 86.416 144.565 131h-.212l-10.829-44.584H100.3v50.634c-.76-9.718-6.732-14.589-13.079-16.771 5.626-3.078 9.342-7.218 9.342-14.862 0-7.749-4.247-19-24.2-19H30.848v75.8h42.994c12.786 0 25.368-7.183 26.455-21.075v21.075h22.081V113.6h.212l13.164 48.62h17.41l13.163-48.62h.213v48.62h22.081v-75.8ZM54.2 104.461h12.317c4.777 0 7.962 1.381 7.962 5.2 0 4.884-3.079 6.264-7.962 6.264H54.2Zm13.694 39.7H54.2v-14.115h14.652c5.521 0 8.174 2.442 8.174 6.9 0 5.839-4.246 7.219-9.126 7.219ZM195.798 86.416h23.355v75.797h-23.355z"/></g></svg>'
      );
    });
    expect(mockRmSync).not.toHaveBeenCalled();
  });

  it("should delete existing brands and create SVGs for each logo when brands directory does exist", () => {
    mockExistsSync.mockReturnValueOnce(true);
    const createdElement = {};
    mockCreateElement.mockReturnValue(createdElement);
    const svgAsString =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250"><path fill="#009fe3" d="M0 0h250v250H0z"></path><g fill="#fff"><path d="M155.393 86.416 144.565 131h-.212l-10.829-44.584H100.3v50.634c-.76-9.718-6.732-14.589-13.079-16.771 5.626-3.078 9.342-7.218 9.342-14.862 0-7.749-4.247-19-24.2-19H30.848v75.8h42.994c12.786 0 25.368-7.183 26.455-21.075v21.075h22.081V113.6h.212l13.164 48.62h17.41l13.163-48.62h.213v48.62h22.081v-75.8ZM54.2 104.461h12.317c4.777 0 7.962 1.381 7.962 5.2 0 4.884-3.079 6.264-7.962 6.264H54.2Zm13.694 39.7H54.2v-14.115h14.652c5.521 0 8.174 2.442 8.174 6.9 0 5.839-4.246 7.219-9.126 7.219ZM195.798 86.416h23.355v75.797h-23.355z"></path></g></svg>';
    mockRenderToString.mockReturnValue(svgAsString);

    createSvgs();

    expect(mockExistsSync).toHaveBeenCalledWith(outDir);
    expect(mockRmSync).toHaveBeenCalledWith(outDir);
    expect(mockMkdirSync).toHaveBeenCalledWith(outDir);
    expect(mockWriteFileSync).toHaveBeenCalledTimes(
      Object.keys(logoIconMap).length
    );
    Object.entries(logoIconMap).forEach(([brandName, logo]) => {
      expect(mockCreateElement).toHaveBeenCalledWith(logo, {});
      expect(mockRenderToString).toHaveBeenCalledWith(createdElement);
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        `${outDir}/${brandName}.svg`,
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250"><path fill="#009fe3" d="M0 0h250v250H0z"/><g fill="#fff"><path d="M155.393 86.416 144.565 131h-.212l-10.829-44.584H100.3v50.634c-.76-9.718-6.732-14.589-13.079-16.771 5.626-3.078 9.342-7.218 9.342-14.862 0-7.749-4.247-19-24.2-19H30.848v75.8h42.994c12.786 0 25.368-7.183 26.455-21.075v21.075h22.081V113.6h.212l13.164 48.62h17.41l13.163-48.62h.213v48.62h22.081v-75.8ZM54.2 104.461h12.317c4.777 0 7.962 1.381 7.962 5.2 0 4.884-3.079 6.264-7.962 6.264H54.2Zm13.694 39.7H54.2v-14.115h14.652c5.521 0 8.174 2.442 8.174 6.9 0 5.839-4.246 7.219-9.126 7.219ZM195.798 86.416h23.355v75.797h-23.355z"/></g></svg>'
      );
    });
  });

  it("should removing leading style tags after creating SVGs for each emotion styled logo", () => {
    mockExistsSync.mockReturnValueOnce(false);
    const createdElement = {};
    mockCreateElement.mockReturnValue(createdElement);
    const svgAsString =
      '<style data-emotion="css 87lb9q">.css-87lb9q{padding:0!important;}</style><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" class="css-87lb9q"><path fill="#009fe3" d="M0 0h250v250H0z"></path><g fill="#fff"><path d="M155.393 86.416 144.565 131h-.212l-10.829-44.584H100.3v50.634c-.76-9.718-6.732-14.589-13.079-16.771 5.626-3.078 9.342-7.218 9.342-14.862 0-7.749-4.247-19-24.2-19H30.848v75.8h42.994c12.786 0 25.368-7.183 26.455-21.075v21.075h22.081V113.6h.212l13.164 48.62h17.41l13.163-48.62h.213v48.62h22.081v-75.8ZM54.2 104.461h12.317c4.777 0 7.962 1.381 7.962 5.2 0 4.884-3.079 6.264-7.962 6.264H54.2Zm13.694 39.7H54.2v-14.115h14.652c5.521 0 8.174 2.442 8.174 6.9 0 5.839-4.246 7.219-9.126 7.219ZM195.798 86.416h23.355v75.797h-23.355z"></path></g></svg>';
    mockRenderToString.mockReturnValue(svgAsString);

    createSvgs();

    expect(mockExistsSync).toHaveBeenCalledWith(outDir);
    expect(mockMkdirSync).toHaveBeenCalledWith(outDir);
    expect(mockWriteFileSync).toHaveBeenCalledTimes(
      Object.keys(logoIconMap).length
    );
    Object.entries(logoIconMap).forEach(([brandName, logo]) => {
      expect(mockCreateElement).toHaveBeenCalledWith(logo, {});
      expect(mockRenderToString).toHaveBeenCalledWith(createdElement);
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        `${outDir}/${brandName}.svg`,
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" class="css-87lb9q"><path fill="#009fe3" d="M0 0h250v250H0z"/><g fill="#fff"><path d="M155.393 86.416 144.565 131h-.212l-10.829-44.584H100.3v50.634c-.76-9.718-6.732-14.589-13.079-16.771 5.626-3.078 9.342-7.218 9.342-14.862 0-7.749-4.247-19-24.2-19H30.848v75.8h42.994c12.786 0 25.368-7.183 26.455-21.075v21.075h22.081V113.6h.212l13.164 48.62h17.41l13.163-48.62h.213v48.62h22.081v-75.8ZM54.2 104.461h12.317c4.777 0 7.962 1.381 7.962 5.2 0 4.884-3.079 6.264-7.962 6.264H54.2Zm13.694 39.7H54.2v-14.115h14.652c5.521 0 8.174 2.442 8.174 6.9 0 5.839-4.246 7.219-9.126 7.219ZM195.798 86.416h23.355v75.797h-23.355z"/></g></svg>'
      );
    });
    expect(mockRmSync).not.toHaveBeenCalled();
  });
});
