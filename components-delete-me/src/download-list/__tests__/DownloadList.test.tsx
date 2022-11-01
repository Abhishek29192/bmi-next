import React, { useContext, useEffect } from "react";
import { act, cleanup, fireEvent } from "@testing-library/react";
import DownloadList, { DownloadListContext } from "../DownloadList";
import { renderWithThemeProvider } from "../../__tests__/helper";

afterEach(cleanup);

describe("DownloadList component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <DownloadList onChange={() => {}}>
        <DownloadList.Checkbox
          name="id-1"
          ariaLabel="first checkbox"
          value={true}
        />
        <button>Download</button>
      </DownloadList>
    );
    expect(container).toMatchSnapshot();
  });

  it("triggers an onChange event", async () => {
    const onChange = jest.fn();
    const label = "Label";
    const { findByLabelText } = renderWithThemeProvider(
      <DownloadList maxSize={200000} onChange={onChange}>
        <DownloadList.Checkbox
          name="id-1"
          ariaLabel={label}
          fileSize={100000}
          value={true}
        />

        <DownloadList.Button label="Download ({{count}})" onClick={() => {}} />
      </DownloadList>
    );

    fireEvent.click(await findByLabelText(label));

    expect(onChange).toBeCalledTimes(1);
  });

  it("triggers an onClick event", async () => {
    const onClick = jest.fn();
    const label = "Download";
    const { findByText } = renderWithThemeProvider(
      <DownloadList initialList={{ "id-1": true }}>
        <DownloadList.Checkbox name="id-1" ariaLabel="Label" value={true} />

        <DownloadList.Button onClick={onClick} label={label} />
      </DownloadList>
    );

    await act(async () => {
      fireEvent.click(await findByText(label));
    });

    expect(onClick).toBeCalledTimes(1);
  });

  it("triggers an onChange event when clearing", async () => {
    const onChange = jest.fn();
    const label = "Clear";
    const { findByText } = renderWithThemeProvider(
      <DownloadList initialList={{ "id-1": true }} onChange={onChange}>
        <DownloadList.Checkbox name="id-1" ariaLabel="Label" value={true} />

        <DownloadList.Clear label={label} />
      </DownloadList>
    );

    fireEvent.click(await findByText(label));

    expect(onChange).toBeCalledTimes(1);
  });

  it("triggers an onChange event when Checkbox clicked", async () => {
    const onChange = jest.fn();
    const label = "Checkbox";
    const { findByText } = renderWithThemeProvider(
      <DownloadList initialList={{ "id-1": true }} onChange={onChange}>
        <DownloadList.Checkbox
          label={label}
          name="id-1"
          ariaLabel="Label"
          value={true}
        />

        <DownloadList.Clear label="Label" />
      </DownloadList>
    );

    fireEvent.click(await findByText(label));

    expect(onChange).toBeCalledTimes(1);
  });

  it("renders DownloadListCheckbox properly without context", () => {
    const Component = () => {
      const { updateList, resetList, setIsLoading } =
        useContext(DownloadListContext);
      useEffect(() => {
        updateList("test", "test");
        setIsLoading(false);
        resetList();
      }, []);

      return (
        <DownloadList.Checkbox
          data-testid="testID"
          name="id-1"
          ariaLabel="first checkbox"
          value={true}
        />
      );
    };

    const { container } = renderWithThemeProvider(<Component />);
    expect(container).toMatchSnapshot();
  });

  it("renders DownloadListButton properly without context", () => {
    const Component = () => {
      const { updateList, resetList, setIsLoading } =
        useContext(DownloadListContext);
      useEffect(() => {
        updateList("test", "test");
        setIsLoading(false);
        resetList();
      }, []);

      return <DownloadList.Button onClick={() => {}} label="label" />;
    };

    const { container } = renderWithThemeProvider(<Component />);
    expect(container).toMatchSnapshot();
  });

  it("renders DownloadListClear properly without context", () => {
    const Component = () => {
      const { updateList, resetList, setIsLoading } =
        useContext(DownloadListContext);
      useEffect(() => {
        updateList("test", "test");
        setIsLoading(false);
        resetList();
      }, []);

      return <DownloadList.Clear label="Label" />;
    };

    const { container } = renderWithThemeProvider(<Component />);
    expect(container).toMatchSnapshot();
  });
});
