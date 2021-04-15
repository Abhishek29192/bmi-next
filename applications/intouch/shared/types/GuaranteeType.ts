export type GuaranteeQuery = {
  guarantee: Guarantee;
};

export type Guarantee = {
  id: number;
  status: string;
  requestorAccount: RequestorAccount;
  projectId: number;
  project: Project;
  startDate: string;
  expiry: string;
  issueNumber: string;
  guaranteedProducts: GuaranteedProducts;
  guaranteeTypeId: string;
  guaranteeType: GuaranteeType;
};
export type RequestorAccount = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type Project = {
  id: number;
  name: string;
  technology: string;
  buildingOwnerFirstname: string;
  buildingOwnerLastname: string;
  buildingOwnerCompany: string;
  buildingOwnerMail: string;
  roofArea: number;
  company: Company;
  addresses: Addresses;
};

export type Company = {
  id: number;
  name: string;
  referenceNumber: string;
};
export type Addresses = {
  nodes: Address[];
};

export type Address = {
  projectId: number;
  companyId: any;
  firstLine: string;
  secondLine: string;
  town: string;
  country: string;
  postcode: string;
  addressType: string;
};

export type GuaranteeType = {
  id: string;
  name: string;
  displayName: string;
  technology: string;
  coverage: string;
  signature: Signature;
  guaranteeTemplatesCollection: GuaranteeTemplatesCollection;
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
  guaranteeScope: string;
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

export type GuaranteedProducts = {
  nodes: GuaranteedProduct[];
};
export type GuaranteedProduct = {
  productId: number;
  product: Product;
};

export type Product = {
  id: number;
  name: String;
  technology: String;
};
