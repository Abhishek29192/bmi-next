import { nodeBuilder, Props } from "../utils";
import { NODE_TYPES } from "../types";
import { createCertificationMock } from "./helpers/createCertificationMock";
import type { SourceNodesArgs } from "gatsby";

const mockGatsbyApi = {
  actions: {
    createNode: jest.fn()
  },
  createNodeId: jest.fn(),
  createContentDigest: jest.fn()
} as unknown as SourceNodesArgs;

const certification = createCertificationMock();

const mockInput = {
  type: NODE_TYPES.Certifications,
  data: certification
};
const props: Props = {
  gatsbyApi: mockGatsbyApi,
  input: mockInput,
  itemId: certification.id_cert
};

describe("nodeBuilder", () => {
  it("works correctly", () => {
    nodeBuilder(props);
    const expectedId = `${mockInput.type}-${mockInput.data.id_cert}`;

    expect(mockGatsbyApi.createNodeId).toHaveBeenCalledWith(expectedId);
    expect(mockGatsbyApi.createContentDigest).toHaveBeenCalledWith(
      props.input.data
    );
    expect(mockGatsbyApi.actions.createNode).toHaveBeenCalledWith({
      ...props.input.data,
      id: mockGatsbyApi.createNodeId(expectedId),
      parent: null,
      children: [],
      internal: {
        type: props.input.type,
        contentDigest: mockGatsbyApi.createContentDigest(props.input.data)
      }
    });
  });
});
