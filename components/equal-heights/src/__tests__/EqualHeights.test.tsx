import React from "react";
import EqualHeights from "../";
import { render } from "@testing-library/react";

describe("EqualHeights component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <EqualHeights>
        <EqualHeights.Consumer shouldDisableBoxSizing>
          {({ addRef, equalHeight }) => {
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
              </div>
            );
          }}
        </EqualHeights.Consumer>
      </EqualHeights>
    );

    // NOTE: test window resize
    global.dispatchEvent(new Event("resize"));

    expect(container.firstChild).toMatchSnapshot();
  });
});
