import {
  accessControlAllowOrigin,
  contentSecurityPolicy,
  xRobotTags
} from "../httpHeadersHelper.mjs";

const soleCsp = "sole content security policy";
const commonCsp =
  "default-src 'self' https: https://*.test.org; script-src 'self' https://somescript.com";
const soleXRobotsTag = "sole x robots tag";
const commonXRobotsTag = "common x robots tag";
const soleAccessControlAllowOrigin = "sole access control allow origin";
const commonAccessControlAllowOrigin = "common access control allow origin";

const norwayCsp =
  "frame-src https://someframe.com; script-src https://norway-script.com";
const mergedNorwayCsp =
  "default-src 'self' https: https://*.test.org; script-src 'self' https://somescript.com https://norway-script.com; frame-src https://someframe.com";
const norwayXRobotsTags = "norway x robots tag";
const norwayAccessControlAllowOrigin = "norway access control allow origin";

describe("Content Security Policy", () => {
  it("Returns sole Content Security Policy when it is not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(contentSecurityPolicy("grp")).toEqual(soleCsp);
  });

  it("Returns common Content Security Policy when it is Netlify and an override is not available", () => {
    process.env.IS_NETLIFY = "true";
    delete process.env.QA_DXB_CONTENT_SECURITY_POLICY_GRP;
    expect(contentSecurityPolicy("grp")).toEqual(commonCsp);
    delete process.env.IS_NETLIFY;
  });

  it("Returns Norway Content Security Policy when a market prefix is passed and an overide is available", () => {
    process.env.IS_NETLIFY = "true";
    process.env.QA_DXB_CONTENT_SECURITY_POLICY_NO = norwayCsp;
    expect(contentSecurityPolicy("no")).toEqual(mergedNorwayCsp);
    delete process.env.IS_NETLIFY;
    delete process.env.QA_DXB_CONTENT_SECURITY_POLICY_NO;
  });
});

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
