import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// Replace react-player/lazy with react-player
// Fix Segmentation Fault when using 'react-player/lazy' in tests
// Learn more: https://github.com/cookpete/react-player/issues/1391
jest.mock("react-player/lazy", () => {
  return jest.requireActual("react-player");
});

Object.assign(global, { TextDecoder, TextEncoder });
global.fetch = jest.fn().mockResolvedValue({ json: () => ({}) });
