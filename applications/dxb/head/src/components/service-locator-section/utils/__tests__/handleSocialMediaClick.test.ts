import { pushToDataLayer } from "../../../../utils/google-tag-manager";
import { selectedRooferMock } from "../../__mocks__/markers";
import { handleSocialMediaClick, ID, Props } from "../handleSocialMediaClick";

jest.mock("../../../../utils/google-tag-manager");

const props: Props = {
  channel: "facebook",
  service: {
    ...selectedRooferMock,
    facebook: "blah"
  }
};

describe("handleSocialMediaClick", () => {
  describe("When social-media link is clicked", () => {
    const { channel, service } = props;
    const { address, certification, entryType, name } = service;
    const roofProLevel = certification
      ? `- ${certification.toLowerCase()} `
      : "";
    const label = `${name} - ${address} ${roofProLevel}- ${entryType} - ${channel}`;

    it("should submit analytics information", () => {
      handleSocialMediaClick(props);
      expect(pushToDataLayer).toBeCalledTimes(1);
      expect(pushToDataLayer).toBeCalledWith({
        action: channel,
        id: ID,
        label
      });
    });

    it("should return true", () => {
      const result = handleSocialMediaClick(props);
      expect(result).toBe(true);
    });

    describe('When service does not include "RoofPro" level', () => {
      it('should not send "RoofPro" level in analytics', () => {
        jest.clearAllMocks();
        const label = `${name} - ${address} - ${entryType} - ${channel}`;

        handleSocialMediaClick({
          channel,
          service: { ...service, certification: undefined }
        });
        expect(pushToDataLayer).toBeCalledTimes(1);
        expect(pushToDataLayer).toBeCalledWith({
          action: channel,
          id: ID,
          label
        });
      });
    });
  });
});
