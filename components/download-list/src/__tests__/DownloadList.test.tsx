import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import DownloadList from "../";

afterEach(cleanup);

describe("DownloadList component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <GoogleReCaptchaProvider reCaptchaKey="TEST_RECAPTCHA_KEY">
        <DownloadList onChange={() => {}}>
          <DownloadList.Checkbox
            name="id-1"
            ariaLabel="first checkbox"
            value={true}
          />
          <DownloadList.Clear label="Clear" />
          <DownloadList.Button
            label="Download ({{count}})"
            onClick={() => {}}
          />
        </DownloadList>
      </GoogleReCaptchaProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("triggers an onChange event", async () => {
    const onChange = jest.fn();
    const label = "Label";
    const { findByLabelText } = render(
      <GoogleReCaptchaProvider reCaptchaKey="TEST_RECAPTCHA_KEY">
        <DownloadList onChange={onChange}>
          <DownloadList.Checkbox name="id-1" ariaLabel={label} value={true} />

          <DownloadList.Button
            label="Download ({{count}})"
            onClick={() => {}}
          />
        </DownloadList>
      </GoogleReCaptchaProvider>
    );

    fireEvent.click(await findByLabelText(label));

    expect(onChange.mock.calls).toMatchSnapshot();
  });
  it("triggers an onClick event", async () => {
    const onClick = jest.fn();
    const label = "Download";
    const { findByText } = render(
      <GoogleReCaptchaProvider reCaptchaKey="TEST_RECAPTCHA_KEY">
        <DownloadList>
          <DownloadList.Checkbox name="id-1" ariaLabel={label} value={true} />

          <DownloadList.Button label="Download" onClick={onClick} />
        </DownloadList>
      </GoogleReCaptchaProvider>
    );

    await act(async () => fireEvent.click(await findByText(label)));

    expect(onClick.mock.calls).toMatchSnapshot();
  });
  it("triggers an onClick event when clearing", async () => {
    const onClick = jest.fn();
    const label = "Clear";
    const { findByText } = render(
      <GoogleReCaptchaProvider reCaptchaKey="TEST_RECAPTCHA_KEY">
        <DownloadList>
          <DownloadList.Checkbox name="id-1" ariaLabel={label} value={true} />

          <DownloadList.Clear label="Clear" />
        </DownloadList>
      </GoogleReCaptchaProvider>
    );

    fireEvent.click(await findByText(label));

    expect(onClick.mock.calls).toMatchSnapshot();
  });
});
