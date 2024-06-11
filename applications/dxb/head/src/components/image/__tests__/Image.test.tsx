import React from "react";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createGatsbyImageData from "../../../__tests__/helpers/GatsbyImageDataHelper";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";
import Image from "../Image";

describe("createImageProps", () => {
  describe("Gatsby Image", () => {
    it("should render the Image component if gatsbyImageData is defined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null,
        image: {
          file: { fileName: "example-filename" },
          gatsbyImageData: createGatsbyImageData()
        }
      });

      const { container } = renderWithProviders(<Image {...imageData} />);

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with 'cover' object-fit styling if size is defined as 'cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} size="cover" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with 'contain' object-fit styling if size is defined as 'contain'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} size="contain" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with the 'contain' object-fit styling if size is defined as 'Descriptive'", () => {
      const imageData = createImageData({
        focalPoint: null,
        type: "Descriptive"
      });

      const { container } = renderWithProviders(<Image {...imageData} />);

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with the 'cover' object-fit styling if size is defined as 'Decorative'", () => {
      const imageData = createImageData({
        focalPoint: null,
        type: "Decorative"
      });

      const { container } = renderWithProviders(<Image {...imageData} />);

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to the position prop value when defined'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} position="example-object-position-value" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to 'center' when position is an empty string'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} position="" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to 'center' when isMobile is true'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} isMobile={true} />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to 'center' when isMobile is false'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} isMobile={false} />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to the focalPoint percentages when focalPoint is defined and size is cover'", () => {
      const imageData = createImageData({
        type: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} focalPoint={{ x: 10, y: 20 }} size="cover" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to 'center' when focalPoint is null and size is cover'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} size="cover" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to 'center' when focalPoint is undefined and size is cover'", () => {
      const imageData = createImageData({
        type: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} focalPoint={undefined} size="cover" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to 'center' when focalPoint is defined and size is contain'", () => {
      const imageData = createImageData({
        type: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} focalPoint={{ x: 10, y: 20 }} size="contain" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to 'center' when focalPoint is undefined and size is contain'", () => {
      const imageData = createImageData({
        type: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} focalPoint={{ x: 10, y: 20 }} size={undefined} />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with a custom classname when defined", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} className="custom-classname" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's loading property with lazy when the loading prop is 'lazy'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} loading="lazy" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's loading property with 'eager' when the loading prop is 'eager'", () => {
      const imageData = createImageData({
        type: null,
        focalPoint: null
      });

      const { container } = renderWithProviders(
        <Image {...imageData} loading="eager" />
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("HTML Image", () => {
    it("should render a HTML image element when gatsbyImageData is not defined", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} loading="eager" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with 'cover' object-fit styling if size is defined as 'cover'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} size="cover" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with 'contain' object-fit styling if size is defined as 'contain'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} size="contain" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with the 'contain' object-fit styling if size is defined as 'Descriptive'", () => {
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

      const { container } = renderWithProviders(<Image {...imageData} />);

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component with the 'cover' object-fit styling if size is defined as 'Decorative'", () => {
      const imageData = createImageData({
        focalPoint: null,
        type: "Decorative",
        image: {
          file: {
            fileName: "custom-image.jpg",
            url: "http://localhost:8080/custom-image.jpg"
          }
        }
      });

      const { container } = renderWithProviders(<Image {...imageData} />);

      expect(container).toMatchSnapshot();
    });

    it("should render the Image component's object-position styling value equal to the position prop value when defined'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} position="example-position" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should have an object-position style value of 'center' if position is an empty string", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} position="" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should have an object-position style value of 'center' if isMobile is true", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} isMobile={true} />
      );

      expect(container).toMatchSnapshot();
    });

    it("should have an object-position style value of 'center' if isMobile is false", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} isMobile={false} />
      );

      expect(container).toMatchSnapshot();
    });

    it("should have an object-position styling value equal to the focalpoint percentages if focal point is defined and size is 'cover'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} size="cover" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should have an object-position styling value of 'center' if focal point is null and size === 'cover'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} size="cover" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should have an object-position styling value of 'center' if focal point is undefined and size === 'cover'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} size="cover" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should have an object-position styling value equal to 'center' if focal point is defined and size is 'contain'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} size="contain" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should have an object-position property equal to 'center' if focal point is defined and size is undefined", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} size={undefined} />
      );

      expect(container).toMatchSnapshot();
    });

    it("should add a classname if defined", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} className="custom-classname" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should add a loading attribute to the image component if loading === 'lazy'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} loading="lazy" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should add a loading attribute to the image component if loading === 'eager'", () => {
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

      const { container } = renderWithProviders(
        <Image {...imageData} loading="eager" />
      );

      expect(container).toMatchSnapshot();
    });
  });
});
