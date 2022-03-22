import React from "react";
import { navigate } from "gatsby";
import FlatRoofCalculator from "../components/flat-roof-calculator";
import calculatorData from "../components/flat-roof-calculator/samples/calculatorData";
import Page from "../components/Page";
import Container from "../components/Container";
import { treeFieldsDisplay } from "../lib/treeFieldsDisplay";
import { measurementsProps } from "../lib/measurementsProps";
import { inputContent } from "../lib/inputContent";

const APP = () => (
  <Page title="APP Flat Roof Estimator">
    <Container>
      <FlatRoofCalculator
        type="APP"
        productDescription={`App-Bitumen systems are offered in two colour finishes and supported by a 15 Year Product Plus Guarantee.`}
        decisionTreeProps={{
          header: "Input your project details",
          description:
            "To select the right system, please tell us a little bit more about your project."
        }}
        measurementsProps={measurementsProps}
        projectInformationProps={{
          header: "Project information (optional)"
        }}
        calculatorData={calculatorData}
        treeFieldsDisplay={treeFieldsDisplay("APP")}
        navigate={navigate}
        inputContent={inputContent("APP")}
        resultsContent={{
          header: "Recommended system",
          systemDescription: `Developed for use in built-up flat roofing systems, and suitable for warmer climates, the use of Atactic Polypropylene (APP) additive improves slump resistance in the bitumen waterproofing membrane.`,
          features: [
            "15 Year product plus guarantee.",
            "Easy installation at higher temperatures.",
            "Less prone to marking during installation."
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
          extraItemsDescription: `This calculation covers the flat roof system materials, speak to
          your merchant today to discuss the following items that you may
          also need to complete your project.`,
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
          shareLinkDescription: `Copy this link and share. The recipient will be taken back to this
          page with the details shown above.`
        }}
        backButtonLabel={"Back"}
        calculateButtonLabel={"Calculate quantities"}
        calculateNewRoofButtonLabel={"Calculate a new roof"}
        editButtonLabel={"Go back to make edits"}
        downloadPdfButtonLabel={"Download as PDF"}
        downloadPdfButtonLoadingLabel={"Loading PDF..."}
        urlPrefix={(process.env.GATSBY_FRC_URL_PREFIX || "/") + "3d/"}
      />
    </Container>
  </Page>
);

export default APP;
