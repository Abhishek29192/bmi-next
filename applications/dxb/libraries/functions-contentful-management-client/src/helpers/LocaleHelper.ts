import { jest } from "@jest/globals";
import { Locale } from "contentful-management";
import createEntityMetaSysProps from "./EntityMetaSysPropsHelper";
import createMetaLinkProps from "./MetaLinkPropsHelper";

const createLocale = (locale?: Partial<Locale>): Locale => ({
  sys: {
    ...createEntityMetaSysProps(),
    space: { sys: createMetaLinkProps({ linkType: "Space" }) },
    environment: { sys: createMetaLinkProps({ linkType: "Environment" }) }
  },
  name: "English (United States)",
  code: "en-US",
  internal_code: "en-US",
  fallbackCode: null,
  contentDeliveryApi: true,
  contentManagementApi: true,
  default: false,
  optional: false,
  toPlainObject: jest.fn<Locale["toPlainObject"]>(),
  delete: jest.fn<Locale["delete"]>(),
  update: jest.fn<Locale["update"]>(),
  ...locale
});

export default createLocale;
