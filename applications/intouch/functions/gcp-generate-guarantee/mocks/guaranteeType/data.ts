import { ContentfulGuaranteeType } from "@bmi/intouch-api-types";

export const mockGuaranteeType: ContentfulGuaranteeType = {
  name: "System guarantee (flat)",
  displayName: "System guarantee",
  technology: "FLAT",
  coverage: "SYSTEM",
  signature: {
    url: "https://images.ctfassets.net/opay6t6wwmup/5yryu89fGozf04U3duLJkT/38a584c7e430e9b5822b5f2ff74b645f/flat-roof-signature.png"
  },
  guaranteeTemplatesCollection: {
    items: [
      {
        displayName: "System English (flat)",
        approvalMessage: {
          event: "REQUEST_APPROVED",
          format: ["EMAIL", "NOTIFICATION"],
          subject:
            "Your application for a solution guarantee has been approved by BMI",
          notificationBody:
            "Your application for a solution guarantee has been approved by BMI.  Project {{project}} now has a solution guarantee.",
          emailBody:
            "Dear {{firstname}},\n\nYour application for a solution guarantee has been approved by BMI.  Project {{project}} now has a solution guarantee.\n\nThe guarantee has been sent to the building owner.  Log in to InTouch to download a PDF copy.\n\nregards\n\nBMI InTouch Team"
        },
        rejectionMessage: {
          event: "REQUEST_REJECTED",
          format: ["NOTIFICATION", "EMAIL"],
          subject: "More information required.",
          notificationBody:
            "Project {{project}} cannot be approved for a solution guarantee yet.  The reviewer has requested more information.",
          emailBody:
            "Dear {{firstname}},\n\nProject {{project}} cannot be approved for a solution guarantee yet.  The reviewer has requested more information.\n\nPlease log in to InTouch for further details.\n\nregards\n\nBMI InTouch Team"
        },
        logo: {
          url: "https://images.ctfassets.net/opay6t6wwmup/28JN3r2xx9mrZzT9dHkWat/d78108899c91791358179f2714522bf1/guarantee-logo.png"
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
          "BMI Mapleland, Suite 12W, 12th Floor, Ataturk Community Centre, Berrylands, 50350 BL, Mapleland. This Guarantee comprises the above Guarantee Particulars and\nthe below Guarantee Terms. Unless otherwise defined, capitalised terms used throughout this Guarantee will have the meanings/refer to the\ninformation given in the Guarantee Particulars above.",
        maintenanceTemplate: {
          url: "https://assets.ctfassets.net/opay6t6wwmup/2C1rc3L9y6TwG1qz4goRRZ/b31e964f32fa767acfd7dad5f8406757/Maintenance_example_english.pdf"
        },
        guaranteeScope:
          "BMI System Guarantee: Edge to edge complete water and weather proofing for the top of your building",
        terms: {
          url: "https://assets.ctfassets.net/opay6t6wwmup/tFNcSDgoywIHtFrsoD1QU/1ae1b0c4d884c62c98f9290172b059f5/Terms_example_english.pdf"
        },
        mailBody:
          "Your BMI System $$system, is now under warranty with BMI.  Please see attached document.  Regards BMI InRouch Team.",
        filenamePrefix: "BMI System Guarantee MP",
        lockupLine1: null,
        lockupLine2: null,
        roofType: null
      },
      {
        displayName: "System Esperanto (flat)",
        approvalMessage: {
          event: "REQUEST_APPROVED",
          format: ["EMAIL", "NOTIFICATION"],
          subject:
            "Your application for a solution guarantee has been approved by BMI",
          notificationBody:
            "Your application for a solution guarantee has been approved by BMI.  Project {{project}} now has a solution guarantee.",
          emailBody:
            "Dear {{firstname}},\n\nYour application for a solution guarantee has been approved by BMI.  Project {{project}} now has a solution guarantee.\n\nThe guarantee has been sent to the building owner.  Log in to InTouch to download a PDF copy.\n\nregards\n\nBMI InTouch Team"
        },
        rejectionMessage: {
          event: "REQUEST_REJECTED",
          format: ["NOTIFICATION", "EMAIL"],
          subject: "More information required.",
          notificationBody:
            "Project {{project}} cannot be approved for a solution guarantee yet.  The reviewer has requested more information.",
          emailBody:
            "Dear {{firstname}},\n\nProject {{project}} cannot be approved for a solution guarantee yet.  The reviewer has requested more information.\n\nPlease log in to InTouch for further details.\n\nregards\n\nBMI InTouch Team"
        },
        logo: {
          url: "https://images.ctfassets.net/opay6t6wwmup/28JN3r2xx9mrZzT9dHkWat/d78108899c91791358179f2714522bf1/guarantee-logo.png"
        },
        signatory: "Wolf Mozart, Teknika Direktoro",
        headingGuarantee: "Guarantia Nomo",
        headingScope: "Kampo de Garantio",
        headingProducts: "Produktaj Materialoj",
        headingBeneficiary: "Profitantoj kaj konstruaj detaloj",
        headingBuildingOwnerName: "Profito nomo (konstruanto posedanto)",
        headingBuildingAddress: "Konstrua nomo kaj adreso",
        headingRoofArea: "Konstrua tegmenta areo (m2)",
        headingRoofType: "Konstrua tegmentospecifo",
        headingContractor: "Detaloj pri instalado",
        headingContractorName:
          "Nomo de produkta instalilo (tegmenta entreprenisto)",
        headingContractorId:
          "Nomo de produkta instalilo (tegmenta entreprenisto)",
        headingStartDate: "Guarantee start date (installation completion date)",
        headingGuaranteeId: "Garantia numero-numero",
        headingValidity: "Garantia periodo",
        headingExpiry: "Garantia limdato",
        footer:
          "Garantio konsistas el la supraj Garantiaj Informoj kaj\nla ĉi-subaj Garantiaj Kondiĉoj. Krom se alie difinita, majusklaj terminoj uzataj tra ĉi tiu Garantio havos la signifojn / rilatas al la\ninformoj donitaj en la supraj garantiaj informoj.",
        maintenanceTemplate: {
          url: "https://assets.ctfassets.net/opay6t6wwmup/1S5kC7xQNNELVtydZFHwXt/ddd4c3cc317a3d594b579f9242a31788/Maintentance_example_esperanto.pdf"
        },
        guaranteeScope:
          "BMI-Sistema Garantio: Rando al rando kompleta akvo kaj vetero-provado por la supro de via konstruaĵo",
        terms: {
          url: "https://assets.ctfassets.net/opay6t6wwmup/2EKnL9znY2YJ09FKBxI8s/b10561bd87343d7227219ad29599b397/Term_example_esperanto.pdf"
        },
        mailBody:
          "Via BMI-sistemo $$system nun garantias kun BMI. Bonvolu vidi aldonitan dokumenton. Salutas BMI-InRouch-Teamon.",
        filenamePrefix: "BMI System Guarantee MP",
        lockupLine1: null,
        lockupLine2: null,
        roofType: null
      }
    ],
    total: 2,
    skip: 0,
    limit: 100
  }
};
