import { GuaranteeType, GuaranteeData } from "../../../types/GuaranteeType";
import { base64_encode } from "./util/imageUtil";

const guaranteeTypeData: GuaranteeType = {
  id: "7uSy0NeVTgPiJbOiVYW4DX",
  name: "Product guarantee (flat)",
  displayName: "Product guarantee",
  technology: "FLAT",
  coverage: "PRODUCT",

  signature: {
    id: "5yryu89fGozf04U3duLJkT",
    fileName: "flat-roof-signature.png",
    url:
      "https://images.ctfassets.net/opay6t6wwmup/5yryu89fGozf04U3duLJkT/38a584c7e430e9b5822b5f2ff74b645f/flat-roof-signature.png",
    image: ""
  },
  guaranteeTemplatesCollection: [
    {
      logo: {
        title: "Guarantee Logo in English",
        url:
          "https://images.ctfassets.net/opay6t6wwmup/28JN3r2xx9mrZzT9dHkWat/d78108899c91791358179f2714522bf1/guarantee-logo.png",
        image: ""
      },
      maintenanceTemplate: {
        id: "2C1rc3L9y6TwG1qz4goRRZ",
        fileName: "Maintenance example english.pdf",
        url:
          "https://assets.ctfassets.net/opay6t6wwmup/2C1rc3L9y6TwG1qz4goRRZ/b31e964f32fa767acfd7dad5f8406757/Maintenance_example_english.pdf"
      },
      terms: {
        id: "tFNcSDgoywIHtFrsoD1QU",
        fileName: "Terms example english.pdf",
        url:
          "https://assets.ctfassets.net/opay6t6wwmup/tFNcSDgoywIHtFrsoD1QU/1ae1b0c4d884c62c98f9290172b059f5/Terms_example_english.pdf"
      },
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
        "BMI Mapleland, Suite 12W, 12th Floor, Ataturk Community Centre, Berrylands, 50350 BL, Mapleland. This Guarantee comprises the above Guarantee Particulars and\nthe below Guarantee Terms. Unless otherwise defined, capitalised terms used throughout this Guarantee will have the meanings/refer to the\ninformation given in the Guarantee Particulars above."
    },
    {
      logo: {
        title: "Guarantee Esperanto",
        url:
          "https://images.ctfassets.net/opay6t6wwmup/4iEcC7pn6tUi70ynCmb9YU/533447683748672fa79409f89ccb1976/guarantee-logo-esperanto.png",
        image: ""
      },
      maintenanceTemplate: {
        id: "1S5kC7xQNNELVtydZFHwXt",
        fileName: "Maintentance example esperanto.pdf",
        url:
          "https://assets.ctfassets.net/opay6t6wwmup/1S5kC7xQNNELVtydZFHwXt/ddd4c3cc317a3d594b579f9242a31788/Maintentance_example_esperanto.pdf"
      },
      terms: {
        id: "tFNcSDgoywIHtFrsoD1QU",
        fileName: "Terms example esperanto.pdf",
        url:
          "https://assets.ctfassets.net/opay6t6wwmup/2EKnL9znY2YJ09FKBxI8s/b10561bd87343d7227219ad29599b397/Term_example_esperanto.pdf"
      },
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
      headingContractorName:
        "Nomo de produkta instalilo (tegmenta entreprenisto)",
      headingContractorId:
        "BMI InTouch ID de produkta instalilo (tegmenta entreprenisto)",
      headingStartDate: "Garantia komenco-dato (instal-fina dato)",
      headingGuaranteeId: "Garantia numero-numero",
      headingValidity: "Garantia periodo",
      headingExpiry: "Garantia limdato",
      footer:
        "Garantio konsistas el la supraj Garantiaj Informoj kaj\nla ĉi-subaj Garantiaj Kondiĉoj. Krom se alie difinita, majusklaj terminoj uzataj tra ĉi tiu Garantio havos la signifojn / rilatas al la\ninformoj donitaj en la supraj garantiaj informoj."
    }
  ]
};

const guaranteeData: GuaranteeData = {
  guaranteeName: "TPO 60mil Mechanical Fixed",
  guaranteeScope:
    "A guarantee of durability of the resistance against water ingress due to failures of the Product",
  productMaterials: "TPO 60mil Mechanical Fixed",
  buildingParticular: {
    name: "Chris Phippen",
    buildingAddress: "Test Street Kuala Lumpur Malaysia",
    buildingRoofArea: "125"
  },
  installationParticular: {
    name: "Selangor Roofing",
    intouchId: "836015",
    guaranteeStartDate: "08-27-2020",
    guaranteeIssueNumber: "411-889-904",
    guaranteePeriod: "15 years",
    guaranteeExpiryDate: "08-27-2035"
  },
  guaranteeType: guaranteeTypeData
};

export const getGuaranteeData = async () => {
  guaranteeData.guaranteeType.signature.image = await base64_encode(
    guaranteeData.guaranteeType.signature.url
  );

  for (const template of guaranteeData.guaranteeType
    .guaranteeTemplatesCollection) {
    template.logo.image = await base64_encode(template.logo.url);
  }
  return guaranteeData;
};
