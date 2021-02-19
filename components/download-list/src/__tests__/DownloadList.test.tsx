import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import DownloadList from "../";

afterEach(cleanup);

const executeRecaptcha = jest.fn().mockResolvedValue("valid-token");
const recaptchaSpy = jest.spyOn(
  require("react-google-recaptcha-v3"),
  "useGoogleReCaptcha"
);

recaptchaSpy.mockReturnValue({
  executeRecaptcha: executeRecaptcha
});

describe("DownloadList component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <DownloadList
        onChange={() => {}}
        useRecaptcha={false}
        reCaptchaKey={"TEST_RECAPTCHA_KEY"}
        useRecaptchaNet={false}
        language="en-GB"
      >
        <DownloadList.Checkbox
          name="id-1"
          ariaLabel="first checkbox"
          value={true}
        />
        <DownloadList.Clear label="Clear" />
        <DownloadList.Button label="Download ({{count}})" onClick={() => {}} />
      </DownloadList>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with recaptcha", () => {
    const { container } = render(
      <DownloadList
        onChange={() => {}}
        useRecaptcha={true}
        reCaptchaKey={"TEST_RECAPTCHA_KEY"}
        useRecaptchaNet={false}
        language="en-GB"
      >
        <DownloadList.Checkbox
          name="id-1"
          ariaLabel="first checkbox"
          value={true}
        />
        <DownloadList.Clear label="Clear" />
        <DownloadList.Button label="Download ({{count}})" onClick={() => {}} />
      </DownloadList>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with recaptcha using recaptcha.net", () => {
    const { container } = render(
      <DownloadList
        onChange={() => {}}
        useRecaptcha={true}
        reCaptchaKey={"TEST_RECAPTCHA_KEY"}
        useRecaptchaNet={true}
        language="en-GB"
      >
        <DownloadList.Checkbox
          name="id-1"
          ariaLabel="first checkbox"
          value={true}
        />
        <DownloadList.Clear label="Clear" />
        <DownloadList.Button label="Download ({{count}})" onClick={() => {}} />
      </DownloadList>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("triggers an onChange event", async () => {
    const onChange = jest.fn();
    const label = "Label";
    const { findByLabelText } = render(
      <DownloadList onChange={onChange} useRecaptcha={false}>
        <DownloadList.Checkbox name="id-1" ariaLabel={label} value={true} />

        <DownloadList.Button label="Download ({{count}})" onClick={() => {}} />
      </DownloadList>
    );

    fireEvent.click(await findByLabelText(label));

    expect(onChange.mock.calls).toMatchSnapshot();
  });

  it("triggers an onClick event", async () => {
    const onClick = jest.fn();
    const label = "Download";
    const { findByText } = render(
      <DownloadList>
        <DownloadList.Checkbox name="id-1" ariaLabel={label} value={true} />

        <DownloadList.Button label="Download" onClick={onClick} />
      </DownloadList>
    );

    await act(async () => fireEvent.click(await findByText(label)));

    expect(onClick.mock.calls).toMatchSnapshot();
  });

  it("triggers an onClick event with recaptcha", async () => {
    const onClick = jest.fn();
    const label = "Download";
    const { findByText } = render(
      <DownloadList
        useRecaptcha={true}
        reCaptchaKey={"TEST_RECAPTCHA_KEY"}
        useRecaptchaNet={false}
        language="en-GB"
      >
        <DownloadList.Checkbox name="id-1" ariaLabel={label} value={true} />

        <DownloadList.Button label="Download" onClick={onClick} />
      </DownloadList>
    );

    await act(async () => fireEvent.click(await findByText(label)));

    expect(onClick.mock.calls).toMatchSnapshot();
  });

  it("triggers an onClick event when clearing", async () => {
    const onClick = jest.fn();
    const label = "Clear";
    const { findByText } = render(
      <DownloadList>
        <DownloadList.Checkbox name="id-1" ariaLabel={label} value={true} />

        <DownloadList.Clear label="Clear" />
      </DownloadList>
    );

    fireEvent.click(await findByText(label));

    expect(onClick.mock.calls).toMatchSnapshot();
  });
});
