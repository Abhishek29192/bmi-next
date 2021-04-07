import { GuaranteeType } from "../../../types/GuaranteeType";
import { base64_encode } from "./util/imageUtil";

const guaranteeTypeData: GuaranteeType = {
  id: "7uSy0NeVTgPiJbOiVYW4DX",
  name: "Product guarantee (flat)",
  displayName: "Product guarantee",
  technology: "FLAT",
  coverage: "PRODUCT",
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

  signature: {
    id: "5yryu89fGozf04U3duLJkT",
    fileName: "flat-roof-signature.png",
    url:
      "https://images.ctfassets.net/opay6t6wwmup/5yryu89fGozf04U3duLJkT/38a584c7e430e9b5822b5f2ff74b645f/flat-roof-signature.png",
    image: ""
  },
  guaranteeTemplates: [
    {
      logo: {
        contentType: "image/png"
      },
      maintenanceTemplate: {
        id: "2C1rc3L9y6TwG1qz4goRRZ",
        fileName: "Maintenance example english.pdf",
        url:
          "https://assets.ctfassets.net/opay6t6wwmup/2C1rc3L9y6TwG1qz4goRRZ/b31e964f32fa767acfd7dad5f8406757/Maintenance_example_english.pdf"
      }
    },
    {
      logo: {
        contentType: "image/png"
      },
      maintenanceTemplate: {
        id: "1S5kC7xQNNELVtydZFHwXt",
        fileName: "Maintentance example esperanto.pdf",
        url:
          "https://assets.ctfassets.net/opay6t6wwmup/1S5kC7xQNNELVtydZFHwXt/ddd4c3cc317a3d594b579f9242a31788/Maintentance_example_esperanto.pdf"
      }
    }
  ]
};

export const getGuaranteeTypeData = async () => {
  const image = await base64_encode(guaranteeTypeData.signature.url);
  guaranteeTypeData.signature.image = image;
  return guaranteeTypeData;
};
