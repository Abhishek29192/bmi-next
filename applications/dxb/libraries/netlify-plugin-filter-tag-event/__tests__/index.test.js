"use strict";

const mockConsole = require("jest-mock-console");
const index = require("../index");

const mockCancelBuild = jest.fn();
const mockFailBuild = jest.fn();
const mockMethods = {
  utils: {
    build: {
      cancelBuild: mockCancelBuild,
      failBuild: mockFailBuild
    }
  }
};

beforeAll(() => {
  mockConsole(["info"]);
});

beforeEach(() => {
  jest.resetAllMocks();

  process.env.BRANCH = "master";
  process.env.INCOMING_HOOK_BODY = JSON.stringify({
    event_name: "tag_push",
    ref: "refs/tags/v1.0.0-alpha.1"
  });
  process.env.INCOMING_HOOK_TITLE = "title";
  process.env.DXB_FORCE_NETLIFY_BUILD = false;
});

describe("onPreBuild", () => {
  it("should log out the hook title", () => {
    process.env.INCOMING_HOOK_TITLE = "Hook Title";
    index.onPreBuild(mockMethods);
    expect(console.info).toBeCalledWith(
      "Build triggered with the hook: Hook Title"
    );
  });

  it("should log out unknown if there is no hook title", () => {
    delete process.env.INCOMING_HOOK_TITLE;
    index.onPreBuild(mockMethods);
    expect(console.info).toBeCalledWith(
      "Build triggered with the hook: unknown"
    );
  });

  it("should return if not pre-production or production branch", () => {
    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledTimes(0);
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should return if pre-production branch and DXB_FORCE_NETLIFY_BUILD is true", () => {
    process.env.BRANCH = "pre-production";
    process.env.DXB_FORCE_NETLIFY_BUILD = true;

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledTimes(0);
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should return if production branch and DXB_FORCE_NETLIFY_BUILD is true", () => {
    process.env.BRANCH = "pre-production";
    process.env.DXB_FORCE_NETLIFY_BUILD = true;

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledTimes(0);
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should cancel build if pre-production branch INCOMING_HOOK_BODY is undefined", () => {
    process.env.BRANCH = "pre-production";
    delete process.env.INCOMING_HOOK_BODY;

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledWith(
      "Skip build for merge event into pre-production without tag"
    );
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should cancel build if production branch INCOMING_HOOK_BODY is undefined", () => {
    process.env.BRANCH = "production";
    delete process.env.INCOMING_HOOK_BODY;

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledWith(
      "Skip build for merge event into production without tag"
    );
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should cancel build if pre-production branch INCOMING_HOOK_BODY event_name is not tag_push", () => {
    process.env.BRANCH = "pre-production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "not_tag_push",
      ref: "refs/tags/v1.0.0-alpha.1"
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledWith(
      "Skip build for merge event into pre-production without tag"
    );
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should cancel build if production branch INCOMING_HOOK_BODY event_name is not tag_push", () => {
    process.env.BRANCH = "production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "not_tag_push",
      ref: "refs/tags/v1.0.0"
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledWith(
      "Skip build for merge event into production without tag"
    );
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should cancel build if pre-production branch INCOMING_HOOK_BODY ref does not have a tag", () => {
    process.env.BRANCH = "pre-production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "tag_push",
      ref: ""
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledWith(
      "Skip build for merge event into pre-production without tag"
    );
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should cancel build if production branch INCOMING_HOOK_BODY ref does not have a tag", () => {
    process.env.BRANCH = "production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "tag_push",
      ref: ""
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledWith(
      "Skip build for merge event into production without tag"
    );
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should fail build if pre-production branch INCOMING_HOOK_BODY ref is not a valid semantic version", () => {
    process.env.BRANCH = "pre-production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "tag_push",
      ref: "refs/tags/v1"
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledTimes(0);
    expect(mockFailBuild).toBeCalledWith("Tag v1 is not a valid semver.");
  });

  it("should fail build if production branch INCOMING_HOOK_BODY ref is not a valid semantic version", () => {
    process.env.BRANCH = "production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "tag_push",
      ref: "refs/tags/v1"
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledTimes(0);
    expect(mockFailBuild).toBeCalledWith("Tag v1 is not a valid semver.");
  });

  it("should cancel build if pre-production branch and tag is not a pre-release version", () => {
    process.env.BRANCH = "pre-production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "tag_push",
      ref: "refs/tags/v1.0.0"
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledWith(
      "Skip build for tag event (tag: v1.0.0) on pre-production as it is intended for production only."
    );
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should cancel build if production branch and tag is a pre-release version", () => {
    process.env.BRANCH = "production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "tag_push",
      ref: "refs/tags/v1.0.0-alpha.1"
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledWith(
      "Skip build for tag event (tag: v1.0.0-alpha.1) on production as it is intended for pre-production only."
    );
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should return if pre-production branch and tag is a pre-release release version", () => {
    process.env.BRANCH = "pre-production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "tag_push",
      ref: "refs/tags/v1.0.0-alpha.1"
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledTimes(0);
    expect(mockFailBuild).toBeCalledTimes(0);
  });

  it("should return if production branch and tag is a release version", () => {
    process.env.BRANCH = "production";
    process.env.INCOMING_HOOK_BODY = JSON.stringify({
      event_name: "tag_push",
      ref: "refs/tags/v1.0.0"
    });

    index.onPreBuild(mockMethods);

    expect(mockCancelBuild).toBeCalledTimes(0);
    expect(mockFailBuild).toBeCalledTimes(0);
  });
});
