import React from "react";
import ProjectCopyAction from "../Button";
import { generateProject } from "../../../../../lib/tests/factories/project";
import { renderAsDeep, screen } from "../../../../../lib/tests/utils";

jest.mock("../../../../../lib/logger", () => jest.fn());

const mockCopy = jest.fn();
const mockCopyOnCompleted = jest.fn();
const mockCopyOnError = jest.fn();
jest.mock("../../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useCreateProjectMutation: ({ onCompleted, onError }) => {
    mockCopyOnCompleted.mockImplementation((data) => onCompleted(data));
    mockCopyOnError.mockImplementation((data) => onError(data));
    return [mockCopy, { loading: false }];
  }
}));

const mockRouterPush = jest.fn();
jest.mock("next/router", () => {
  const original = jest.requireActual("next/router");
  return {
    ...original,
    useRouter: () => ({
      push: (...params) => mockRouterPush(params)
    })
  };
});

describe("ProjectCopyAction Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("renders correctly and proper flow execution", () => {
    const project = generateProject();
    const { container } = renderAsDeep({ account: { role: "SUPER_ADMIN" } })(
      <ProjectCopyAction parentProject={project} />
    );

    expect(container).toMatchSnapshot();

    const openButton = screen.getByText("projectDetails.cta.copy");
    openButton.click();

    mockCopy.mockReturnValueOnce(
      mockCopyOnCompleted({ createProject: { project } })
    );

    const copyButton = screen.getByText("projectActions.cta.confirm");
    copyButton.click();

    expect(mockRouterPush).toHaveBeenCalledWith([
      `/projects/1`,
      undefined,
      { shallow: false }
    ]);
  });
  it("error", () => {
    const project = generateProject();
    renderAsDeep({ account: { role: "SUPER_ADMIN" } })(
      <ProjectCopyAction parentProject={project} />
    );

    const openButton = screen.getByText("projectDetails.cta.copy");
    openButton.click();

    mockCopy.mockRejectedValueOnce(mockCopyOnError({ message: "error" }));

    expect(mockRouterPush).toBeCalledTimes(0);
  });
});
