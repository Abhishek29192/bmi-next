import { mockContentfulAsset, mockContentfulEntry } from "./utils/contentful";

export const mockTemplateEnglish = {
  ...mockContentfulEntry(),
  logo: mockContentfulAsset({
    fileName: "Guarantee Logo in English",
    url: "https://images.ctfassets.net/opay6t6wwmup/28JN3r2xx9mrZzT9dHkWat/d78108899c91791358179f2714522bf1/guarantee-logo.png"
  }),
  maintenanceTemplate: mockContentfulAsset({
    fileName: "Maintenance example english.pdf",
    url: "https://assets.ctfassets.net/opay6t6wwmup/2C1rc3L9y6TwG1qz4goRRZ/b31e964f32fa767acfd7dad5f8406757/Maintenance_example_english.pdf"
  }),
  terms: mockContentfulAsset({
    fileName: "Terms example english.pdf",
    url: "https://assets.ctfassets.net/opay6t6wwmup/tFNcSDgoywIHtFrsoD1QU/1ae1b0c4d884c62c98f9290172b059f5/Terms_example_english.pdf"
  }),
  guaranteeScope:
    "BMI Product Guarantee: A pretty normal guarantee for pitched roof products.",
  signatory: "Wolf Mozart, Technical Director",
  headingGuarantee: "Guarantee Name",
  headingScope: "Scope of Guarantee",
  headingProducts: "Product Materials",
  headingBeneficiary: "Beneficiary and building particulars",
  headingBuildingOwnerName: "Beneficiary name (building owner)",
  headingBuildingAddress: "Building name and address",
  headingRoofArea: "Building roof area (m2)",
  headingRoofType: "Building roof specification",
  headingContractor: "Installation particulars",
  headingContractorName: "Name of product installer (roofing contractor)",
  headingContractorId:
    "BMI InTouch ID of product installer (roofing contractor)",
  headingStartDate: "Guarantee start date (installation completion date)",
  headingGuaranteeId: "Guarantee issue number",
  headingValidity: "Guarantee period",
  headingExpiry: "Guarantee expiry date",
  footer:
    "BMI Mapleland, Suite 12W, 12th Floor, Ataturk Community Centre, Berrylands, 50350 BL, Mapleland. This Guarantee comprises the above Guarantee Particulars and\nthe below Guarantee Terms. Unless otherwise defined, capitalised terms used throughout this Guarantee will have the meanings/refer to the\ninformation given in the Guarantee Particulars above.",
  filenamePrefix: "BMI Product Guarantee MP",
  titleLine1: "Product",
  titleLine2: "Guarantee",
  roofType: "Flat",
  mailBody:
    "Your BMI Product {{product}}, is now under warranty with BMI.  Please see attached document.  Regards BMI InRouch Team."
};

export const mockTemplateEsperanto = {
  ...mockContentfulEntry(),
  logo: mockContentfulAsset({
    fileName: "Guarantee Esperanto",
    url: "https://images.ctfassets.net/opay6t6wwmup/4iEcC7pn6tUi70ynCmb9YU/533447683748672fa79409f89ccb1976/guarantee-logo-esperanto.png"
  }),
  maintenanceTemplate: mockContentfulAsset({
    fileName: "Maintentance example esperanto.pdf",
    url: "https://assets.ctfassets.net/opay6t6wwmup/1S5kC7xQNNELVtydZFHwXt/ddd4c3cc317a3d594b579f9242a31788/Maintentance_example_esperanto.pdf"
  }),
  terms: mockContentfulAsset({
    fileName: "Terms example esperanto.pdf",
    url: "https://assets.ctfassets.net/opay6t6wwmup/2EKnL9znY2YJ09FKBxI8s/b10561bd87343d7227219ad29599b397/Term_example_esperanto.pdf"
  }),
  guaranteeScope:
    "BMI-Produkta Garantio: Sufiĉe normala garantio por deklivaj tegmentaj produktoj.",
  signatory: "Wolf Mozart, Teknika Direktoro",
  headingGuarantee: "Garantia Nomo",
  headingScope: "Kampo de Garantio",
  headingProducts: "Produktaj Materialoj",
  headingBeneficiary: "Beneficiary and building particulars",
  headingBuildingOwnerName: "Profito nomo (konstruanto posedanto)",
  headingBuildingAddress: "Building name and address",
  headingRoofArea: "Konstrua tegmenta areo (m2)",
  headingRoofType: "Konstrua tegmentospecifo",
  headingContractor: "Detaloj pri instalado",
  headingContractorName: "Nomo de produkta instalilo (tegmenta entreprenisto)",
  headingContractorId:
    "BMI InTouch ID de produkta instalilo (tegmenta entreprenisto)",
  headingStartDate: "Garantia komenco-dato (instal-fina dato)",
  headingGuaranteeId: "Garantia numero-numero",
  headingValidity: "Garantia periodo",
  headingExpiry: "Garantia limdato",
  footer:
    "Garantio konsistas el la supraj Garantiaj Informoj kaj\nla ĉi-subaj Garantiaj Kondiĉoj. Krom se alie difinita, majusklaj terminoj uzataj tra ĉi tiu Garantio havos la signifojn / rilatas al la\ninformoj donitaj en la supraj garantiaj informoj.",
  filenamePrefix: "BMI Produktaj Garantio MP",
  titleLine1: "Produkta",
  titleLine2: "Garantio",
  roofType: "Plata",
  mailBody:
    "Via BMI-Produkto {{product}} nun garantias kun BMI. Bonvolu vidi aldonitan dokumenton. Salutas BMI-InRouch-Teamon."
};
