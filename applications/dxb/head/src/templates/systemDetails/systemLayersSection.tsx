import {
  Accordion,
  AnchorLink,
  AnchorLinkProps,
  Grid,
  Typography
} from "@bmi/components";
import React from "react";
import { useSiteContext } from "../../components/Site";
import { microCopy } from "../../constants/microCopies";
import { Product, SystemLayer } from "../../types/pim";
import withGTM from "../../utils/google-tag-manager";
import { getPathWithCountryCode } from "../../utils/path";

type Props = {
  systemLayers: readonly SystemLayer[];
};

const createLinkAction = (product: Product, countryCode: string) => ({
  model: "htmlLink",
  href: getPathWithCountryCode(countryCode, product.path)
});

const SystemLayersSection = ({ systemLayers }: Props) => {
  const { getMicroCopy, countryCode } = useSiteContext();

  return (
    <Accordion>
      {systemLayers &&
        systemLayers
          .filter(
            (layer) =>
              layer.relatedProducts.length > 0 ||
              layer.relatedOptionalProducts.length > 0
          )
          .map((layer, index) => {
            const relatedProduct = layer.relatedProducts?.[0];
            const productLinkAction =
              relatedProduct && createLinkAction(relatedProduct, countryCode);

            const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink, {
              label: "children"
            });

            const GTMAccordionSummary = withGTM(Accordion.Summary);

            const layerLabel = layer.type ? ` ${layer.type}:` : "";

            const optionalRelatedProducts = (
              layer.relatedOptionalProducts || []
            ).filter((optProduct) => optProduct.name !== relatedProduct.name);

            return (
              <Accordion.Item key={`sdp-system-layer-accordion-item-${index}`}>
                <GTMAccordionSummary
                  gtm={{
                    id: "selector-accordion1",
                    label: `${layer.layerNumber}.${layerLabel} ${
                      layer.name || ""
                    }`,
                    action: "Selector - Accordion"
                  }}
                >
                  <Typography variant="default">
                    {`${layer.layerNumber}.${layerLabel} ${layer.name || ""}`}
                  </Typography>
                </GTMAccordionSummary>

                <Accordion.Details>
                  <Grid container spacing={3}>
                    {relatedProduct && (
                      <Grid item xs={12} md={12} lg={12}>
                        <GTMAnchorLink
                          gtm={{
                            id: "cta-click1",
                            label: relatedProduct.name,
                            action: productLinkAction?.href
                          }}
                          action={productLinkAction}
                        >
                          {relatedProduct.name}
                        </GTMAnchorLink>
                      </Grid>
                    )}

                    <Grid item xs={12} md={12} lg={12}>
                      <Typography variant="default">
                        {layer.shortDescription}
                      </Typography>
                    </Grid>

                    {optionalRelatedProducts.length > 0 && (
                      <Grid item xs={12} md={12} lg={12}>
                        <Typography variant="h5">
                          {getMicroCopy(microCopy.SDP_OPTIONAL_PRODUCTS_TITLE)}
                        </Typography>
                      </Grid>
                    )}

                    {optionalRelatedProducts.map((product, id) => {
                      const productLinkAction = createLinkAction(
                        product,
                        countryCode
                      );
                      return (
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          key={`related-optional-product-${id}`}
                        >
                          <GTMAnchorLink
                            gtm={{
                              id: "cta-click1",
                              label: product.name,
                              action: productLinkAction?.href
                            }}
                            action={productLinkAction}
                          >
                            {product.name}
                          </GTMAnchorLink>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Accordion.Details>
              </Accordion.Item>
            );
          })}
    </Accordion>
  );
};

export default SystemLayersSection;
