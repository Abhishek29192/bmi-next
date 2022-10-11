import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import GeolocationButton, {
  getCurrentPosition,
  getGeolocation
} from "../GeolocationButton";

describe("GeolocationButton component", () => {
  const props = {
    onPosition: jest.fn(),
    onError: jest.fn()
  };

  it("should render correctly", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: jest
          .fn()
          .mockImplementationOnce((resolve) =>
            Promise.resolve(resolve("success"))
          )
      },
      configurable: true
    });

    const container = render(
      <GeolocationButton {...props}>Use my location</GeolocationButton>
    );
    expect(container).toMatchSnapshot();
  });

  it("should disable the use my location button", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      configurable: true
    });

    const { getByRole } = render(
      <GeolocationButton {...props}>Use my location</GeolocationButton>
    );

    const button = getByRole("button", { name: /use my location/i });

    expect(button).toBeDisabled();
  });

  it("should call the onPosition on the use my location button click", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: jest
          .fn()
          .mockImplementationOnce((resolve) =>
            Promise.resolve(resolve("success"))
          )
      },
      configurable: true
    });

    const { getByRole } = render(
      <GeolocationButton {...props}>Use my location</GeolocationButton>
    );

    const button = getByRole("button", { name: /use my location/i });

    fireEvent.click(button);

    await waitFor(() => expect(props.onPosition).toHaveBeenCalled());
  });

  it("should call the onError on the use my location button click", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: jest
          .fn()
          .mockImplementationOnce((_, reject) => reject("error"))
      },
      configurable: true
    });

    const { getByRole } = render(
      <GeolocationButton {...props}>Use my location</GeolocationButton>
    );

    const button = getByRole("button", { name: /use my location/i });

    fireEvent.click(button);

    await waitFor(() => expect(props.onError).toHaveBeenCalled());
  });

  describe("getCurrentPosition", () => {
    it("should resolve with coordinates", async () => {
      Object.defineProperty(global.navigator, "geolocation", {
        value: {
          getCurrentPosition: jest.fn().mockImplementationOnce((resolve) =>
            Promise.resolve(
              resolve({
                coords: {
                  latitude: 46.378333,
                  longitude: 13.836667
                }
              })
            )
          )
        },
        configurable: true
      });

      await expect(getCurrentPosition()).resolves.toEqual({
        coords: { latitude: 46.378333, longitude: 13.836667 }
      });
    });

    it("should reject if a browser does not support the GeoLocation API", async () => {
      Object.defineProperty(global.navigator, "geolocation", {
        value: undefined,
        configurable: true
      });

      await expect(getCurrentPosition()).rejects.toEqual(
        "Your browser does not support the GeoLocation API"
      );
    });
  });

  describe("getGeolocation", () => {
    it("should return navigator.geolocation if navigator is existed", () => {
      Object.defineProperty(global.navigator, "geolocation", {
        value: true,
        configurable: true
      });

      expect(getGeolocation()).toBe(true);
    });

    it("should return undefined if a browser does not supports GeoLocation API", () => {
      Object.defineProperty(global, "navigator", {
        value: undefined,
        configurable: true
      });

      expect(getGeolocation()).toBe(undefined);
    });
  });
});
