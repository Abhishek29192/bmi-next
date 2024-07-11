import type { Data as ServiceLocatorData } from "../../../components/service-locator-section";
import type { Data as ServiceData } from "../../../components/Service";
import type { Data as ServiceTypeData } from "../../../components/ServiceType";
import type { ContentfulRichText } from "./RichText";

export type ContentfulServiceLocatorData = Omit<
  ServiceLocatorData,
  "services" | "body"
> & {
  body: ContentfulRichText | null;
};

export type ContentfulServiceData = Omit<ServiceData, "serviceTypes" | "id"> & {
  serviceTypesCollection: {
    items: ServiceTypeData[];
  };
  sys: {
    id: string;
  };
};
