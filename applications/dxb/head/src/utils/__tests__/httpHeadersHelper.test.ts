import { accessControlAllowOrigin, xRobotTags } from "../httpHeadersHelper.mjs";

const soleXRobotsTag = "sole x robots tag";
const commonXRobotsTag = "common x robots tag";
const soleAccessControlAllowOrigin = "sole access control allow origin";
const commonAccessControlAllowOrigin = "common access control allow origin";

const norwayXRobotsTags = "norway x robots tag";
const norwayAccessControlAllowOrigin = "norway access control allow origin";

describe("X Robots Tag", () => {
  it("Returns sole X Robots Tag when it is not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(xRobotTags("grp")).toEqual(soleXRobotsTag);
  });

  it("Returns common X Robots Tag when Group prefix is passed and no override is available ", () => {
    process.env.IS_NETLIFY = "true";
    expect(xRobotTags("grp")).toEqual(commonXRobotsTag);
    delete process.env.IS_NETLIFY;
  });

  it("Returns Norway X Robots Tag when Norway preifx is passed and an override is available", () => {
    process.env.IS_NETLIFY = "true";
    process.env.QA_DXB_X_ROBOTS_TAG_NO = norwayXRobotsTags;
    expect(xRobotTags("no")).toEqual(norwayXRobotsTags);
    delete process.env.IS_NETLIFY;
    delete process.env.QA_DXB_X_ROBOTS_TAG_NO;
  });
});

describe("Access Control Allow Origin", () => {
  it("Returns sole Access Control Allow Origin when it is not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(accessControlAllowOrigin("grp")).toEqual(
      soleAccessControlAllowOrigin
    );
  });

  it("Returns common Access Control Allow Origin when no override is available", () => {
    process.env.IS_NETLIFY = "true";
    expect(accessControlAllowOrigin("grp")).toEqual(
      commonAccessControlAllowOrigin
    );
    delete process.env.IS_NETLIFY;
  });

  it("Returns Norway Access Contol Allow Origin when Norway preifx is passed and an override is available", () => {
    process.env.IS_NETLIFY = "true";
    process.env.QA_DXB_ACCESS_CONTROL_ALLOW_ORIGIN_NO =
      norwayAccessControlAllowOrigin;
    expect(accessControlAllowOrigin("no")).toEqual(
      norwayAccessControlAllowOrigin
    );
    delete process.env.IS_NETLIFY;
    delete process.env.QA_DXB_ACCESS_CONTROL_ALLOW_ORIGIN_NO;
  });
});
