export type ResultsContent = {
  header: string;
  systemDescription: string;
  features: string[];
  systemContentHeader: string;
  systemContentColumns: {
    buildUp: string;
    category: string;
    product: string;
    code: string;
    quantity: string;
    unit: string;
  };
  extraItemsHeader: string;
  extraItemsDescription: string;
  extraItems: string[];
  inputHeader: string;
  inputDescription: string;
  disclaimerHeader: string;
  disclaimer: string;
  projectInformationHeader: string;
  shareLinkHeader: string;
  shareLinkDescription: string;
};
