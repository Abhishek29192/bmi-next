export type GuaranteeData = {
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

  guaranteeType: GuaranteeType;
};

export type GuaranteeType = {
  id: string;
  name: string;
  displayName: string;
  technology: string;
  coverage: string;
  signature: Signature;
  guaranteeTemplatesCollection: GuaranteeTemplate[];
};

export type Signature = {
  id: string;
  fileName: string;
  url: string;
  image: string;
};

export type GuaranteeTemplatesCollection = {
  items: GuaranteeTemplate[];
};

export type GuaranteeTemplate = {
  logo: Logo;
  maintenanceTemplate: MaintenanceTemplate;
  terms: Terms;
  signatory: string;
  headingGuarantee: string;
  headingScope: string;
  headingProducts: string;
  headingBeneficiary: string;
  headingBuildingOwnerName: string;
  headingBuildingAddress: string;
  headingRoofArea: string;
  headingRoofType: string;
  headingContractor: string;
  headingContractorName: string;
  headingContractorId: string;
  headingStartDate: string;
  headingGuaranteeId: string;
  headingValidity: string;
  headingExpiry: string;
  footer: string;
};

export type Logo = {
  title: string;
  url: string;
  image: string;
};

export type MaintenanceTemplate = {
  id: string;
  fileName: string;
  url: string;
};

export type Terms = {
  id: string;
  fileName: string;
  url: string;
};
