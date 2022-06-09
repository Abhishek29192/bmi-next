import React from "react";
import { RichTextData } from "../../components/RichText";
import { isRichText } from "../isRichText";

const richTextMock: RichTextData = {
  raw: "rich-text-raw",
  references: [
    {
      __typename: "paragraph",
      contentful_id: "rich-text-reference-contentful-id"
    }
  ]
};

describe("isRichText function", () => {
  it("returns 'true'", () => {
    expect(isRichText(richTextMock)).toBeTruthy();
  });

  it("returns 'false'", () => {
    expect(isRichText(<p>mock</p>)).toBeFalsy();
    expect(isRichText("mock")).toBeFalsy();
    expect(isRichText({ raw: richTextMock.raw })).toBeFalsy();
    expect(isRichText({ references: richTextMock.references })).toBeFalsy();
    expect(isRichText({ ...richTextMock, testField: "mock" })).toBeFalsy();
  });
});
