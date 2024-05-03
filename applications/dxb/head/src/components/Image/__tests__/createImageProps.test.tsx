import { GatsbyImage } from "gatsby-plugin-image";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createImageProps from "../createImageProps";
import createGatsbyImageData from "../../../__tests__/helpers/GatsbyImageDataHelper";

describe("createImageProps", () => {
  describe("Gatsby Image", () => {
    it("should create an object with the following properties by default if gatsbyImageData is defined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: { fileName: "example-filename" },
          gatsbyImageData: createGatsbyImageData()
        }
      });

      expect(createImageProps(imageData)).toEqual({
        alt: "Image alt text",
        className: undefined,
        component: GatsbyImage,
        "data-testid": undefined,
        draggable: false,
        image: {
          backgroundColor: "#484848",
          height: 720,
          images: {
            fallback: {
              sizes: "(min-width: 948px) 948px, 100vw",
              src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
              srcSet:
                "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w"
            },
            sources: [
              {
                sizes: "(min-width: 948px) 948px, 100vw",
                srcSet:
                  "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
                type: "image/webp"
              }
            ]
          },
          layout: "constrained",
          width: 948
        },
        loading: "lazy",
        objectFit: "cover",
        objectPosition: "center"
      });
    });

    it("should have an objectFit property of cover if size is defined as 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });
      expect(createImageProps({ ...imageData, size: "cover" })).toHaveProperty(
        "objectFit",
        "cover"
      );
    });

    it("should have an objectFit property of contain if size is defined as 'contain'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });
      expect(
        createImageProps({ ...imageData, size: "contain" })
      ).toHaveProperty("objectFit", "contain");
    });

    it("should have an objectFit property of contain if type is defined as 'Descriptive'", () => {
      const imageData = createImageData({
        focalPoint: null,
        type: "Descriptive"
      });
      expect(createImageProps(imageData)).toHaveProperty(
        "objectFit",
        "contain"
      );
    });

    it("should have an objectFit property of cover if type is defined as 'Decorative'", () => {
      const imageData = createImageData({
        focalPoint: null
      });
      expect(createImageProps(imageData)).toHaveProperty("objectFit", "cover");
    });

    it("should have an objectPosition property equal to the position prop if defined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });
      expect(
        createImageProps({
          ...imageData,
          position: "example-position"
        })
      ).toHaveProperty("objectPosition", "example-position");
    });

    it("should have an objectPosition property of 'center' if position is an empty string", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });
      expect(
        createImageProps({
          ...imageData,
          position: ""
        })
      ).toHaveProperty("objectPosition", "center");
    });

    it("should have an objectPosition property of 'center' if isMobile is true", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });
      expect(
        createImageProps({
          ...imageData,
          isMobile: true
        })
      ).toHaveProperty("objectPosition", "center");
    });

    it("should have an objectPosition property of 'center' if isMobile is false", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });
      expect(
        createImageProps({
          ...imageData,
          isMobile: false
        })
      ).toHaveProperty("objectPosition", "center");
    });

    it("should have an objectPosition property equal to the focalpoint percentages if focal point is defined and size is 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: { x: 10, y: 20 }
      });
      expect(
        createImageProps({
          ...imageData,
          size: "cover"
        })
      ).toHaveProperty("objectPosition", "10% 20%");
    });

    it("should have an objectPosition property of 'center' if focal point is null and size === 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });
      expect(
        createImageProps({
          ...imageData,
          size: "cover"
        })
      ).toHaveProperty("objectPosition", "center");
    });

    it("should have an objectPosition property of 'center' if focal point is undefined and size === 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: undefined
      });
      expect(
        createImageProps({
          ...imageData,
          size: "cover"
        })
      ).toHaveProperty("objectPosition", "center");
    });

    it("should have an objectPosition property equal to 'center' if focal point is defined and size is 'contain'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: { x: 10, y: 20 }
      });
      expect(
        createImageProps({
          ...imageData,
          size: "contain"
        })
      ).toHaveProperty("objectPosition", "center");
    });

    it("should have an objectPosition property equal to 'center' if focal point is defined and size is undefined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: { x: 10, y: 20 }
      });
      expect(
        createImageProps({
          ...imageData,
          size: undefined
        })
      ).toHaveProperty("objectPosition", "center");
    });

    it("should add a classname to the object if defined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });
      expect(
        createImageProps({
          ...imageData,
          className: "custom-classname"
        })
      ).toHaveProperty("className", "custom-classname");
    });

    it("should add a loading property to the object if loading === 'lazy'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        loading: "lazy"
      });
      expect(createImageProps(imageData)).toHaveProperty("loading", "lazy");
    });

    it("should add a loading property to the object if loading === 'eager'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        loading: "eager"
      });
      expect(createImageProps(imageData)).toHaveProperty("loading", "eager");
    });
  });

  describe("HTML Image", () => {
    it("should create an object with the following properties by default when image.file.url is defined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(createImageProps(imageData)).toEqual({
        alt: "Image alt text",
        className: undefined,
        "data-testid": undefined,
        loading: "lazy",
        src: "http://localhost:8080/custom-image.jpg",
        style: {
          objectFit: "cover",
          objectPosition: "center"
        }
      });
    });

    it("should have an objectFit property of cover if size is defined as 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(createImageProps({ ...imageData, size: "cover" })).toHaveProperty(
        "style.objectFit",
        "cover"
      );
    });

    it("should have an objectFit property of contain if size is defined as 'contain'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({ ...imageData, size: "contain" })
      ).toHaveProperty("style.objectFit", "contain");
    });

    it("should have an objectFit property of contain if type is defined as 'Descriptive'", () => {
      const imageData = createImageData({
        focalPoint: null,
        type: "Descriptive",
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(createImageProps(imageData)).toHaveProperty(
        "style.objectFit",
        "contain"
      );
    });

    it("should have an objectFit property of cover if type is defined as 'Decorative'", () => {
      const imageData = createImageData({
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(createImageProps(imageData)).toHaveProperty(
        "style.objectFit",
        "cover"
      );
    });

    it("should have an objectPosition property equal to the position prop if defined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          position: "example-position"
        })
      ).toHaveProperty("style.objectPosition", "example-position");
    });

    it("should have an objectPosition property of 'center' if position is an empty string", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          position: ""
        })
      ).toHaveProperty("style.objectPosition", "center");
    });

    it("should have an objectPosition property of 'center' if isMobile is true", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          isMobile: true
        })
      ).toHaveProperty("style.objectPosition", "center");
    });

    it("should have an objectPosition property of 'center' if isMobile is false", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          isMobile: false
        })
      ).toHaveProperty("style.objectPosition", "center");
    });

    it("should have an objectPosition property equal to the focalpoint percentages if focal point is defined and size is 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: { x: 10, y: 20 },
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          size: "cover"
        })
      ).toHaveProperty("style.objectPosition", "10% 20%");
    });

    it("should have an objectPosition property of 'center' if focal point is null and size === 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          size: "cover"
        })
      ).toHaveProperty("style.objectPosition", "center");
    });

    it("should have an objectPosition property of 'center' if focal point is undefined and size === 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: undefined,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          size: "cover"
        })
      ).toHaveProperty("style.objectPosition", "center");
    });

    it("should have an objectPosition property equal to 'center' if focal point is defined and size is 'contain'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: { x: 10, y: 20 },
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          size: "contain"
        })
      ).toHaveProperty("style.objectPosition", "center");
    });

    it("should have an objectPosition property equal to 'center' if focal point is defined and size is undefined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: { x: 10, y: 20 },
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          size: undefined
        })
      ).toHaveProperty("style.objectPosition", "center");
    });

    it("should add a classname to the object if defined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(
        createImageProps({
          ...imageData,
          className: "custom-classname"
        })
      ).toHaveProperty("className", "custom-classname");
    });

    it("should add a loading property to the object if loading === 'lazy'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        loading: "lazy",
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(createImageProps(imageData)).toHaveProperty("loading", "lazy");
    });

    it("should add a loading property to the object if loading === 'eager'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        loading: "eager",
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });
      expect(createImageProps(imageData)).toHaveProperty("loading", "eager");
    });
  });
});
