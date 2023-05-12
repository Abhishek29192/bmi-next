import { selectedRooferMock } from "../../__mocks__/markers";
import { getSocialMediaGtm, ID, Props } from "../getSocialMediaGtm";

const props: Props = {
  channel: "facebook",
  service: {
    ...selectedRooferMock,
    facebook: "blah"
  }
};

describe("getSocialMediaGtm", () => {
  describe("When social-media link is clicked", () => {
    const { channel, service } = props;
    const { address, certification, serviceTypes, name } = service;
    const roofProLevel = certification
      ? `- ${certification.toLowerCase()} `
      : "";

    const serviceType = serviceTypes.map(({ name }) => name).join(", ");
    const label = `${name} - ${address} ${roofProLevel}- ${serviceType} - ${channel}`;

    it("should return analytics information", () => {
      const result = getSocialMediaGtm(props);
      expect(result).toEqual({
        action: channel,
        id: ID,
        label
      });
    });

    describe('When service does not include "RoofPro" level', () => {
      it('should not return "RoofPro" level in analytics', () => {
        jest.clearAllMocks();
        const label = `${name} - ${address} - ${serviceType} - ${channel}`;

        const result = getSocialMediaGtm({
          channel,
          service: { ...service, certification: undefined }
        });

        expect(result).toEqual({
          action: channel,
          id: ID,
          label
        });
      });
    });

    describe("When service has multiple service types ", () => {
      it("should create a label with comma separated service types", () => {
        jest.clearAllMocks();

        const serviceTypes = [
          {
            ["__typename"]: "ContentfulService" as any,
            name: "foo"
          },
          {
            ["__typename"]: "ContentfulService" as any,
            name: "bar"
          }
        ];

        const serviceType = `${serviceTypes[0].name}, ${serviceTypes[1].name}`;
        const label = `${name} - ${address} - ${serviceType} - ${channel}`;

        const result = getSocialMediaGtm({
          channel,
          service: { ...service, serviceTypes }
        });

        expect(result).toEqual({
          action: channel,
          id: ID,
          label
        });
      });
    });

    describe("When service has NO service types ", () => {
      it("should create a label with NO service type", () => {
        jest.clearAllMocks();

        const serviceTypes = [];

        const label = `${name} - ${address} -  - ${channel}`;

        const result = getSocialMediaGtm({
          channel,
          service: { ...service, serviceTypes }
        });

        expect(result).toEqual({
          action: channel,
          id: ID,
          label
        });
      });
    });
  });
});
