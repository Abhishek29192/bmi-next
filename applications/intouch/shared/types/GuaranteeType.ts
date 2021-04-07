export type GuaranteeType = {
  id: string;
  name: string;
  displayName: string;
  technology: string;
  coverage: string;
  guaranteeName: string;
  guaranteeScope: string;
  productMaterials: string;
  buildingParticular: {
    name: string;
    buildingAddress: string;
    buildingRoofArea: string;
  };
  installationParticular: {
    name: string;
    intouchId: string;
    guaranteeStartDate: string;
    guaranteeIssueNumber: string;
    guaranteePeriod: string;
    guaranteeExpiryDate: string;
  };
  signature: {
    id: string;
    fileName: string;
    url: string;
    image: string;
  };
  guaranteeTemplates: GuaranteeTemplates[];
  [rest: string]: any;
};

export type GuaranteeTemplates = {
  logo: {
    contentType: string;
  };
  maintenanceTemplate: {
    id: string;
    fileName: string;
    url: string;
  };
};
