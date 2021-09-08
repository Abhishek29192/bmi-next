import React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import DownloadList from "../";

afterEach(cleanup);

describe("DownloadList component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <DownloadList onChange={() => {}}>
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
      <DownloadList onChange={onChange}>
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
      <DownloadList initialList={{ "id-1": true }}>
        <DownloadList.Checkbox name="id-1" ariaLabel="Label" value={true} />

        <DownloadList.Button label={label} onClick={onClick} />
      </DownloadList>
    );

    await act(async () => {
      fireEvent.click(await findByText(label));
    });

    expect(onClick.mock.calls).toMatchSnapshot();
  });

  it("triggers an onChange event when clearing", async () => {
    const onChange = jest.fn();
    const label = "Clear";
    const { findByText } = render(
      <DownloadList initialList={{ "id-1": true }} onChange={onChange}>
        <DownloadList.Checkbox name="id-1" ariaLabel="Label" value={true} />

        <DownloadList.Clear label={label} />
      </DownloadList>
    );

    fireEvent.click(await findByText(label));

    expect(onChange.mock.calls).toMatchSnapshot();
  });
});
