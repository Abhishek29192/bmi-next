import React from "react";
import { Notification } from "..";
import "@testing-library/jest-dom/extend-expect";
import { renderWithI18NProvider } from "../../../lib/tests/utils";
import { screen } from "../../../lib/tests/utils";

const i18nMock = jest.fn().mockReturnValue({ language: "en_EN" });

jest.mock("next-i18next", () => {
  const original = jest.requireActual("next-i18next");
  return {
    ...original,
    useTranslation: () => ({ i18n: i18nMock() })
  };
});

describe("Notification", () => {
  const getInitialProps = () => ({
    message: "message, [messageLink](/projects/1)",
    date: "2021-01-01",
    read: true
  });
  const yearDifferent =
    new Date().getFullYear() -
    new Date(Date.parse(getInitialProps().date)).getFullYear();

  jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

  it("render correctly", () => {
    const { container } = renderWithI18NProvider(
      <Notification {...getInitialProps()} />
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText(`${yearDifferent} year ago`)).toBeTruthy();
    expect(screen.getByText("messageLink")).toHaveAttribute(
      "href",
      "/projects/1"
    );
  });

  it("render unread style when read prop is false", () => {
    const { container } = renderWithI18NProvider(
      <Notification {...{ ...getInitialProps(), read: false }} />
    );

    expect(container.querySelector(".unread")).toBeTruthy();
  });

  it("render correct language for time ago", () => {
    i18nMock.mockReturnValue({ language: "nb_NO" });
    renderWithI18NProvider(<Notification {...getInitialProps()} />);

    expect(screen.getByText(`for ${yearDifferent} år siden`)).toBeTruthy();
  });

  it("render default language for time ago if that locale is not installed", () => {
    i18nMock.mockReturnValue({ language: "ja_JP" });
    renderWithI18NProvider(<Notification {...getInitialProps()} />);

    expect(screen.getByText(`${yearDifferent} year ago`)).toBeTruthy();
  });
});
