import { Guarantee, GuaranteeType } from "../../../types/GuaranteeType";
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
  guaranteeTemplatesCollection: {
    items: [
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
  }
};

const guarantee: Guarantee = {
  id: 1,
  status: "APPROVED",
  requestorAccount: {
    id: 5,
    firstName: "Kort",
    lastName: "Pohls",
    email: "kpohls4@photobucket.com",
    phone: "6644664"
  },
  projectId: 1,
  project: {
    id: 1,
    name: "868 Sommers Crossing",
    technology: "FLAT",
    buildingOwnerFirstname: "Christie",
    buildingOwnerLastname: "Cardenoza",
    buildingOwnerCompany: "Devpoint",
    buildingOwnerMail: "ccardenoza0@sogou.com",
    roofArea: 504,
    company: {
      id: 2,
      name: "Lehner-Gislason",
      referenceNumber: "64772-300"
    },
    addresses: {
      nodes: [
        {
          projectId: 1,
          companyId: null,
          firstLine: "4719 Farwell Road",
          secondLine: "Tennyson",
          town: "Losino-Petrovskiy",
          country: "Russia",
          postcode: "19570-005",
          addressType: "SITE"
        },
        {
          projectId: 1,
          companyId: null,
          firstLine: "8 Boyd Terrace",
          secondLine: "Ohio",
          town: "Flórina",
          country: "Greece",
          postcode: "19570-035",
          addressType: null
        }
      ]
    }
  },
  startDate: "2020-12-18T12:00:00",
  expiry: "2050-12-18T12:00:00",
  issueNumber: "61715-062",
  guaranteeTypeId: "7uSy0NeVTgPiJbOiVYW4DX",
  guaranteedProducts: {
    nodes: [
      {
        productId: 1,

        product: {
          id: 1,
          name: "BMI Braas Otcom Professional-1XL-1",
          technology: "PITCHED"
        }
      },
      {
        productId: 2,
        product: {
          id: 2,
          name: "BMI Schiedel Asoka Professional-2XL-2",
          technology: "PITCHED"
        }
      },
      {
        productId: 3,
        product: {
          id: 3,
          name: "BMI Monier Temp Professional-3XL-2",
          technology: "PITCHED"
        }
      }
    ]
  },
  guaranteeType: guaranteeTypeData
};

export const getGuarantee = async () => {
  guarantee.guaranteeType.signature.image = await base64_encode(
    guarantee.guaranteeType.signature.url
  );

  for (const template of guarantee.guaranteeType.guaranteeTemplatesCollection
    .items) {
    template.logo.image = await base64_encode(template.logo.url);
  }
  return guarantee;
};
