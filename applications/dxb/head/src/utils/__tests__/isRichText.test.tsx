import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import { isRichText } from "../isRichText";
import type { RichTextData } from "../../components/RichText";

const richTextMock: RichTextData = {
  json: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: []
  },
  references: new Map()
};

describe("isRichText function", () => {
  it("returns 'true'", () => {
    expect(isRichText(richTextMock)).toBeTruthy();
  });

  it("returns 'false'", () => {
    expect(isRichText(<p>mock</p>)).toBeFalsy();
    expect(isRichText("mock")).toBeFalsy();
    expect(isRichText({ json: richTextMock.json })).toBeFalsy();
    expect(isRichText({ references: richTextMock.references })).toBeFalsy();
    expect(isRichText({ ...richTextMock, testField: "mock" })).toBeFalsy();
  });
});
