import ContentfulImage from "../ContentfulImage";
import { Context, Node } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn()
  }
};

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null,
  image___NODE: "image",
  focalPoint___NODE: "focalPoint"
};

describe("ContentfulImage resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulImage.focalPoint.type).toBe("FocalPoint");
  });
  it("should return null if source without image___NODE and focalPoint___NODE", async () => {
    expect(
      await ContentfulImage.focalPoint.resolve(
        { ...source, image___NODE: null, focalPoint___NODE: null },
        null,
        context
      )
    ).toBeNull();
  });
  it("should return null if no focalPoint found", async () => {
    context.nodeModel.getNodeById = jest.fn().mockResolvedValue({
      file: {
        details: {
          image: {
            width: 100,
            height: 100
          }
        }
      }
    });

    expect(
      await ContentfulImage.focalPoint.resolve(source, null, context)
    ).toBeNull();
  });
  it("should resolve focalPoint", async () => {
    context.nodeModel.getNodeById = jest.fn().mockResolvedValue({
      file: {
        details: {
          image: {
            width: 120,
            height: 120
          }
        }
      },
      focalPoint: {
        x: 20,
        y: 80
      }
    });

    expect(
      await ContentfulImage.focalPoint.resolve(source, null, context)
    ).toEqual({ x: 17, y: 67 });
  });
});
