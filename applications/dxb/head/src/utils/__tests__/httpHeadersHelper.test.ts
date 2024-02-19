import {
  accessControlAllowOrigin,
  contentSecurityPolicy,
  xRobotTags
} from "../httpHeadersHelper.mjs";

const genericContentSecurityPolicy = "group content security policy";
const genericXRobotsTag = "group x robots tag";
const genericAccessControlAllowOrigin = "group access control allow origin";

const norwayContentSecurityPolicy = "norway content security policy";
const norwayXRobotsTags = "norway x robots tag";
const norwayAccessControlAllowOrigin = "norway access control allow origin";

describe("Content Security Policy", () => {
  it("Returns generic Content Security Policy when Group prefix is passed and is not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(contentSecurityPolicy("grp")).toEqual(genericContentSecurityPolicy);
  });

  it("Returns generic Content Security Policy when Group prefix is passed and is Netlify", () => {
    process.env.IS_NETLIFY = "true";
    expect(contentSecurityPolicy("grp")).toEqual(genericContentSecurityPolicy);
    delete process.env.IS_NETLIFY;
  });

  it("Returns generic Content Security Policy when a market prefix is passed, but not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(contentSecurityPolicy("no")).toEqual(genericContentSecurityPolicy);
  });

  it("Returns Norway Content Security Policy when a market prefix is passed and is netlify", () => {
    process.env.IS_NETLIFY = "true";
    expect(contentSecurityPolicy("no")).toEqual(norwayContentSecurityPolicy);
    delete process.env.IS_NETLIFY;
  });
});

describe("X Robots Tag", () => {
  it("Returns generic X Robots Tag when Group prefix is passed and is not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(xRobotTags("grp")).toEqual(genericXRobotsTag);
  });

  it("Returns generic X Robots Tag when Group prefix is passed and is Netlify", () => {
    process.env.IS_NETLIFY = "true";
    expect(xRobotTags("grp")).toEqual(genericXRobotsTag);
    delete process.env.IS_NETLIFY;
  });

  it("Returns Norway X Robots Tag when Norway preifx is passed and is Netlify", () => {
    process.env.IS_NETLIFY = "true";
    expect(xRobotTags("no")).toEqual(norwayXRobotsTags);
    delete process.env.IS_NETLIFY;
  });

  it("Returns genericRobots Tag when Norway preifx is passed and is not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(xRobotTags("no")).toEqual(genericXRobotsTag);
  });
});

describe("Access Control Allow Origin", () => {
  it("Returns generic Access Control Allow Origin Group prefix is passed and is not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(accessControlAllowOrigin("grp")).toEqual(
      genericAccessControlAllowOrigin
    );
  });

  it("Returns generic Access Control Allow Origin Group prefix is passed and is Netlify", () => {
    process.env.IS_NETLIFY = "true";
    expect(accessControlAllowOrigin("grp")).toEqual(
      genericAccessControlAllowOrigin
    );
    delete process.env.IS_NETLIFY;
  });

  it("Returns Norway Access Contol Allow Origin when Norway preifx is passed and is Netlify", () => {
    process.env.IS_NETLIFY = "true";
    expect(accessControlAllowOrigin("no")).toEqual(
      norwayAccessControlAllowOrigin
    );
    delete process.env.IS_NETLIFY;
  });

  it("Returns generic Access Contol Allow Origin when Norway preifx is passed and is not Netlify", () => {
    delete process.env.IS_NETLIFY;
    expect(accessControlAllowOrigin("no")).toEqual(
      genericAccessControlAllowOrigin
    );
  });
});
