import React from "react";
import { Header } from "../";
import { renderAsDeep, screen, fireEvent, act } from "../../../lib/tests/utils";

const updateNotificationsSpy = jest.fn();
jest.mock("../../../graphql/generated/hooks", () => ({
  useMarkAllNotificationsAsReadMutation: ({ onCompleted, onError }) => [
    () => updateNotificationsSpy({ onCompleted, onError })
  ]
}));
const logSpy = jest.fn();
jest.mock("../../../lib/logger", () => {
  const original = jest.requireActual("../../../lib/logger");
  return {
    __esModule: true,
    ...original,
    default: (log) => logSpy(log)
  };
});
const i18nSpy = jest.fn().mockReturnValue({ language: "en_EN" });
jest.mock("next-i18next", () => {
  const original = jest.requireActual("next-i18next");
  return {
    ...original,
    useTranslation: () => ({
      i18n: i18nSpy(),
      t: (key) => key
    })
  };
});
jest.mock("react-time-ago", () => {
  const original = jest.requireActual("react-time-ago");
  return {
    __esModule: true,
    ...original,
    default: () => jest.fn()
  };
});

describe("Header Component", () => {
  const initialProps = () => ({
    title: "header",
    contactUsLink: {
      href: "http://contact-us.com",
      label: "contact-us",
      isExternal: false
    },
    globalExternalLink: {
      href: "http://global-external-link.com",
      label: "global-external-link",
      isExternal: false
    }
  });

  it("normal case", () => {
    const props = initialProps();
    const { container } = renderAsDeep({
      account: { role: "SUPER_ADMIN" }
    })(<Header {...props} />);

    //upperHeader
    expect(screen.queryByText(props.contactUsLink.label)).toBeTruthy();
    expect(screen.queryByText(props.globalExternalLink.label)).toBeTruthy();
    //midHeader
    expect(container.querySelector(".logo")).toBeTruthy();
    expect(container.querySelector("#notifications-panel-toggle")).toBeTruthy();
    expect(container.querySelector(".tabletNavButton")).toBeTruthy();
    expect(container.querySelector(".mobileNavButton")).toBeTruthy();
    //lowerHeader
    expect(container.querySelector(".notificationsIcon")).toBeTruthy();
    expect(screen.queryByText(props.title)).toBeTruthy();
    expect(screen.queryByText(`roles.SUPER_ADMIN`)).toBeTruthy();
  });

  it("notification drawer", async () => {
    const markAllNotificationsAsRead = {
      markAllNotificationsAsRead: { notifications: [{ id: "1" }] }
    };
    updateNotificationsSpy.mockImplementationOnce(({ onCompleted }) =>
      onCompleted(markAllNotificationsAsRead)
    );
    const props = { ...initialProps(), notifications: [] };
    const { container } = renderAsDeep({
      account: { role: "SUPER_ADMIN", account: { id: 1 } }
    })(<Header {...props} />);

    const notificationButton = container.querySelector(".notificationsIcon");
    await fireEvent.click(notificationButton);

    expect(screen.queryByTestId("notification-panel")).toBeTruthy();

    await fireEvent.click(notificationButton);
    expect(logSpy).toHaveBeenCalledWith({
      severity: "INFO",
      message: `${markAllNotificationsAsRead.markAllNotificationsAsRead.notifications.length} Notifications for account [1] set as read.`
    });
  });

  it("markAllNotificationsAsRead onError", async () => {
    const errorMessage = "error Message";
    updateNotificationsSpy.mockImplementationOnce(({ onError }) =>
      onError(errorMessage)
    );
    const props = { ...initialProps(), notifications: [] };
    const { container } = renderAsDeep({
      account: { role: "SUPER_ADMIN" }
    })(<Header {...props} />);

    const notificationButton = container.querySelector(".notificationsIcon");
    await fireEvent.click(notificationButton);
    await fireEvent.click(notificationButton);

    expect(logSpy).toHaveBeenCalledWith({
      severity: "ERROR",
      message: `There was an error marking notifications as read: ${errorMessage}`
    });
  });

  it("resize", async () => {
    const props = { ...initialProps(), notifications: [] };
    renderAsDeep({
      account: { role: "SUPER_ADMIN" }
    })(<Header {...props} />);

    await act(() => {
      window.innerWidth = 500;
      window.innerHeight = 500;

      fireEvent(window, new Event("resize"));
    });
  });

  it("should show attentionHeading when company is deactivated", () => {
    const props = initialProps();
    renderAsDeep({
      account: {
        role: "INSTALLER",
        hasCompany: true,
        companyStatus: "DEACTIVATED"
      }
    })(<Header {...props} />);

    expect(screen.queryByText("deactivatedCompany")).toBeTruthy();
  });

  it("shouldn't show attentionHeading when company has no status", () => {
    const props = initialProps();
    renderAsDeep({
      account: {
        role: "INSTALLER",
        hasCompany: false
      }
    })(<Header {...props} />);

    expect(screen.queryByText("deactivatedCompany")).toBeFalsy();
  });

  it("hide notification for auditor", async () => {
    const props = { ...initialProps(), notifications: [] };
    const { container } = renderAsDeep({
      account: { role: "AUDITOR" }
    })(<Header {...props} />);

    expect(container.querySelector("#notifications-panel-toggle")).toBeFalsy();
    expect(container.querySelector(".notificationsIcon")).toBeFalsy();
  });

  it("MobileNavButton", async () => {
    const props = { ...initialProps(), notifications: [] };
    const { container } = renderAsDeep({
      account: { role: "SUPER_ADMIN" }
    })(<Header {...props} />);

    const button = container.querySelector("#mobile-navigation-panel-toggle");
    await fireEvent.click(button);

    expect(screen.queryByTestId("mobile-user-menu")).toBeTruthy();
  });

  it("TabletNavButton", async () => {
    const props = { ...initialProps(), notifications: [] };
    const { container } = renderAsDeep({
      account: { role: "SUPER_ADMIN" }
    })(<Header {...props} />);

    const button = container.querySelector("#tablet-navigation-panel-toggle");
    await fireEvent.click(button);

    expect(screen.queryByTestId("mobile-user-menu")).toBeTruthy();
  });

  it("should hide contactUsLink if no contactUsLink passed in", () => {
    const props = { ...initialProps(), contactUsLink: null };
    renderAsDeep({
      account: { role: "SUPER_ADMIN" }
    })(<Header {...props} />);

    expect(screen.queryByTestId("contact-us-link")).toBeFalsy();
  });

  it("should hide globalExternalLink if no globalExternalLink passed in", () => {
    const props = { ...initialProps(), globalExternalLink: null };
    renderAsDeep({
      account: { role: "SUPER_ADMIN" }
    })(<Header {...props} />);

    expect(screen.queryByTestId("global-external-link")).toBeFalsy();
  });
});
