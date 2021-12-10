import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import EqualHeights from "../EqualHeights";

const mockElements = (shouldDisableBoxSizing: boolean = true) => (
  <EqualHeights.Consumer shouldDisableBoxSizing={shouldDisableBoxSizing}>
    {({ addRef, equalHeight, updateRef }) => {
      const elementStyle = {
        background: "#EEE",
        padding: "10px",
        margin: "5px",
        height: equalHeight
      };

      return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div>
            <div style={elementStyle}>
              <div ref={addRef(1)}>not much text</div>
            </div>
            <div style={elementStyle}>
              <div ref={addRef(2) as React.RefObject<HTMLDivElement>}>
                Tempor do labore <br /> proident aute commodo
                <br />
                enim quis duis.
              </div>
            </div>
          </div>
          <div>
            <div style={elementStyle}>
              <div ref={addRef(3) as React.RefObject<HTMLDivElement>}>
                something
              </div>
            </div>
            <div style={elementStyle}>
              <div ref={addRef(4) as React.RefObject<HTMLDivElement>}>
                another
              </div>
            </div>
          </div>
          <button onClick={updateRef} />
        </div>
      );
    }}
  </EqualHeights.Consumer>
);

describe("EqualHeights component", () => {
  describe("renders correctly", () => {
    it("should set equal height auto to added elements", () => {
      const { container } = render(
        <EqualHeights>{mockElements(true)}</EqualHeights>
      );

      // NOTE: test window resize
      global.dispatchEvent(new Event("resize"));
      fireEvent.click(screen.getByRole("button"));

      expect(container.firstChild).toMatchSnapshot();
    });
    it("should set equal height to added elements", () => {
      let count = 0;
      Object.defineProperties(window.HTMLElement.prototype, {
        clientHeight: {
          get: () => {
            count++;
            if (count % 2) {
              return 196;
            }
            return 100;
          }
        }
      });
      const { container } = render(
        <EqualHeights>{mockElements(false)}</EqualHeights>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("test EqualHeights.Consumer without Provider", () => {
    it("should call addRef method from default context", () => {
      const { container } = render(<>{mockElements(undefined)}</>);
      fireEvent.click(screen.getByRole("button"));
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
