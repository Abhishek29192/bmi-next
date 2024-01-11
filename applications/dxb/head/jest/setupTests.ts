import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// Replace react-player/lazy with "react-player". Initially tried to replace
// with non-lazy implementation, but that also throws a segemtnation fault.
// Fix Segmentation Fault when using 'react-player/lazy' in tests
// Learn more: https://github.com/cookpete/react-player/issues/1391
jest.mock("react-player/lazy", () => {
  return "react-player";
});

Object.assign(global, { TextDecoder, TextEncoder });
global.fetch = jest.fn().mockResolvedValue({ json: () => ({}) });
global.ResizeObserver = require("resize-observer-polyfill");
