import { render } from "@testing-library/react";
import React from "react";
import FlatRoofCalculator from "../";
import calculatorData from "../samples/calculatorData";

describe("FlatRoofCalculator component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <FlatRoofCalculator
        type="SBS"
        productDescription={`SBS-Bitumen is our premium product, offered in three colour ways, supported by a 15 or 20 year guarantee. Suitable for combustible and non combustible decks.`}
        decisionTreeProps={{
          header: "Input your project details",
          description:
            "To select the right system, please tell us a little bit more about your project."
        }}
        measurementsProps={{
          header: "Your roofing measurements",
          help: {
            fieldArea: <p>Some help text for field area field</p>,
            upstand: <p>Some help text for upstand fields</p>
          }
        }}
        projectInformationProps={{
          header: "Project information (optional)"
        }}
        calculatorData={calculatorData}
        treeFieldsDisplay={{
          guarantee: {
            label: "Product guarantee",
            description:
              "Please select the guarantee length that you require for this project.",
            defaultValue: "20",
            options: {
              20: { label: "20 year System" },
              15: { label: "15 Year System" }
            }
          },
          combustible: {
            label: "Roof substrate",
            description:
              "Please select the roof substrate for your project. We recommend torch-safe roofing systems for combustible substrate types such as timber, plywood and OSB.",
            options: {
              Yes: { label: "Combustible (timber/plywood)" },
              No: { label: "Non-combustible (metal/concrete)" }
            }
          },
          insulated: {
            label: "Roof insulation",
            description:
              "Please select if this roof is insulated or uninsulated.",
            options: {
              Yes: { label: "Insulated (Warm roof)" },
              No: { label: "Uninsulated (Cold-roof)" }
            }
          },
          color: {
            label: "Capsheet colour",
            description:
              "Please select the desired colour finish of the system.",
            helpContent: <p>There are 4 colours available for SBS</p>,
            options: {
              Green: {
                label: "Green",
                before: (
                  <div
                    style={{
                      minHeight: "100%",
                      minWidth: 72,
                      backgroundColor: "#619D66"
                    }}
                  />
                )
              },
              Charcoal: {
                label: "Charcoal",
                before: (
                  <div
                    style={{
                      minHeight: "100%",
                      minWidth: 72,
                      backgroundColor: "#36454f"
                    }}
                  />
                )
              },
              "Blue/Grey": {
                label: "Blue/Grey",
                before: (
                  <div
                    style={{
                      minHeight: "100%",
                      minWidth: 72,
                      backgroundColor: "#6699CC"
                    }}
                  />
                )
              }
            }
          }
        }}
        navigate={console.log}
        inputContent={{
          header: `SBS Bitumen Estimator`,
          helpHeader: "Need some help?",
          helpDescription: (
            <>
              Your local BMI Area Sales Manager can support you with step by
              step guidance in using this tool.
              <br />
              Alternatively, please call +44 (0) 330 1234 585 to speak to a BMI
              Technical Advisor.
              <br />
              Icopalestimating @bmigroup.com
            </>
          )
        }}
        resultsContent={{
          header: "Recommended system",
          systemDescription:
            "Manufactured in the UK, and ideal for our climate, this torch-on flat bitumen roof sheet system features a strong polyester reinforcement, coated with SBS Polymer Modified Bitumen.",
          features: [
            "15 and 20 year product plus guarantee options.",
            "Greater flexibility at low temperatures.",
            "Easy application for all skill levels.",
            "Outstanding long-term weather protection."
          ],
          systemContentHeader: "Products in the system",
          systemContentColumns: {
            buildUp: "Build up",
            category: "Product",
            product: "Product name",
            code: "Product code",
            quantity: "Quantity",
            unit: "Unit"
          },
          extraItemsHeader: "You might also need",
          extraItemsDescription:
            "This calculation covers the flat roof system materials, speak to your merchant today to discuss the following items that you may also need to complete your project.",
          extraItems: [
            "Gas",
            "Angle Fillets",
            "Drip Formers",
            "GRP Trims",
            "Screws & Nails",
            "Insulation",
            "Insulation Adhesive",
            "Rainwater Outlets / Grates",
            "Vent Collars",
            "Cable and Pipe Ducts",
            "Lightning Conductor Pads",
            "Rooflights",
            "Cover Flashings"
          ],
          inputHeader: "System recommendation and estimate based on",
          inputDescription: "This estimate is based upon the following inputs:",
          disclaimerHeader: "Disclaimer",
          disclaimer:
            "This flat roof materials quantity estimate has been calculated upon the input and information provided by you in this calculator. The estimate allows for head and side laps and materials wastage at 5%. We cannot accept liability for any consequential costs. This estimate is for flat roofing waterproofing materials only and does not include quantities for insulation or accessories.",
          projectInformationHeader: "Project information",
          shareLinkHeader: "Copy and share this estimation",
          shareLinkDescription:
            "Copy this link and share. The recipient will be taken back to this page with the details shown above."
        }}
        backButtonLabel={"Back"}
        calculateButtonLabel={"Calculate quantities"}
        calculateNewRoofButtonLabel={"Calculate a new roof"}
        editButtonLabel={"Go back to make edits"}
        downloadPdfButtonLabel={"Download as PDF"}
        downloadPdfButtonLoadingLabel={"Loading PDF..."}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
