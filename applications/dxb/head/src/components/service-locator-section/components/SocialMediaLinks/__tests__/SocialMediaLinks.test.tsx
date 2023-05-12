import { screen } from "@testing-library/react";
import React from "react";
import createRoofer from "../../../../../__tests__/helpers/ServiceHelper";
import { renderWithProviders } from "../../../../../__tests__/renderWithProviders";
import { Data as Service } from "../../../../Service";
import { Props, SocialMediaLinks } from "../SocialMediaLinks";

const service = createRoofer();

const props: Props = {
  service
};

const channels: Partial<Service> = {
  facebook: "boop",
  instagram: "beep",
  linkedIn: "bang",
  twitter: "boom"
};

describe("SocialMediaLinks component", () => {
  it("renders correctly", () => {
    const { container } = renderWithProviders(<SocialMediaLinks {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('has the default "data-testid" attribute', () => {
    renderWithProviders(<SocialMediaLinks {...props} />);
    expect(screen.getByTestId("social-media-links")).toBeInTheDocument();
  });

  Object.keys(channels).forEach((channel) => {
    describe(`When a ${channel} link is provided`, () => {
      const updatedProps = {
        ...props,
        service: { ...props.service, ...channels }
      };

      it(`displays a ${channel} link`, () => {
        renderWithProviders(<SocialMediaLinks {...updatedProps} />);

        expect(
          screen.getByLabelText(channel, { exact: false })
        ).toBeInTheDocument();
      });

      it("uses the correct link url", () => {
        renderWithProviders(<SocialMediaLinks {...updatedProps} />);
        expect(screen.getByLabelText(channel)).toHaveAttribute(
          "href",
          `https://www.${channel.toLowerCase()}.com/${
            channels[channel as string]
          }`
        );
      });
    });

    describe(`When a ${channel} link is NOT provided`, () => {
      const updatedChannels = Object.keys(channels).reduce(
        (acc, curr) =>
          curr === channel ? acc : { ...acc, [curr]: channels[curr as string] },
        {}
      );

      const updatedProps = {
        ...props,
        service: { ...props.service, ...updatedChannels }
      };
      it(`does NOT display a ${channel} link`, () => {
        renderWithProviders(<SocialMediaLinks {...updatedProps} />);

        expect(
          screen.queryByTestId(`${channel}Icon`, { exact: false })
        ).not.toBeInTheDocument();
      });
    });
  });
});
