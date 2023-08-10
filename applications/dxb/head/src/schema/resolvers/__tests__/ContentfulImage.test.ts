import ContentfulImage from "../ContentfulImage";
import { Context, Node, ResolveArgs } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn()
  }
};

const args: ResolveArgs = { categoryCodes: [], allowFilterBy: [] };

const source: Node = {
  id: "source",
  children: [],
  parent: null,
  internal: { type: "", contentDigest: "", owner: "" },
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
        { ...source, image___NODE: undefined, focalPoint___NODE: undefined },
        args,
        context
      )
    ).toBeNull();
  });

  it("returns null if image file details are undefined", async () => {
    context.nodeModel.getNodeById = jest.fn().mockResolvedValue({
      file: {
        details: {}
      }
    });
    expect(
      await ContentfulImage.focalPoint.resolve(source, args, context)
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
      await ContentfulImage.focalPoint.resolve(source, args, context)
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
      await ContentfulImage.focalPoint.resolve(source, args, context)
    ).toEqual({ x: 17, y: 67 });
  });
});
