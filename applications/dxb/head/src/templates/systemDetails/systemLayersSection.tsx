import Accordion from "@bmi-digital/components/accordion";
import AnchorLink from "@bmi-digital/components/anchor-link";
import Grid from "@bmi-digital/components/grid";
import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import { useSiteContext } from "../../components/Site";
import { SystemLayer } from "../../types/pim";
import withGTM from "../../utils/google-tag-manager";
import { getPathWithCountryCode } from "../../utils/path";

type Props = {
  systemLayers: readonly SystemLayer[];
};

const SystemLayersSection = ({ systemLayers }: Props) => {
  const { getMicroCopy, countryCode } = useSiteContext();

  return (
    <Accordion data-testid="system-layers-accordion">
      {systemLayers &&
        systemLayers.map((layer, index) => {
          const relatedProduct = layer.relatedProducts?.[0];
          const productLink =
            relatedProduct &&
            getPathWithCountryCode(countryCode, relatedProduct.path);

          const GTMAccordionSummary = withGTM(Accordion.Summary);

          const layerLabel = layer.type ? ` ${layer.type}:` : "";

          const optionalRelatedProducts = (
            layer.relatedOptionalProducts || []
          ).filter((optProduct) => optProduct.name !== relatedProduct?.name);

          const hasAccordionItemDetailsData = Boolean(
            relatedProduct ||
              layer.shortDescription ||
              optionalRelatedProducts.length > 0
          );

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
                data-testid="system-layer-summary"
              >
                <Typography variant="default">
                  {`${layer.layerNumber}.${layerLabel} ${layer.name || ""}`}
                </Typography>
              </GTMAccordionSummary>

              {hasAccordionItemDetailsData && (
                <Accordion.Details>
                  <Grid
                    container
                    spacing={3}
                    data-testid="system-layer-details"
                  >
                    {relatedProduct && (
                      <Grid xs={12} md={12} lg={12}>
                        <AnchorLink
                          gtm={{
                            id: "cta-click1",
                            label: relatedProduct.name,
                            action: productLink
                          }}
                          href={productLink}
                        >
                          {relatedProduct.name}
                        </AnchorLink>
                      </Grid>
                    )}

                    <Grid xs={12} md={12} lg={12}>
                      <Typography variant="default">
                        {layer.shortDescription}
                      </Typography>
                    </Grid>

                    {optionalRelatedProducts.length > 0 && (
                      <Grid xs={12} md={12} lg={12}>
                        <Typography variant="h5">
                          {getMicroCopy(microCopy.SDP_OPTIONAL_PRODUCTS_TITLE)}
                        </Typography>
                      </Grid>
                    )}

                    {optionalRelatedProducts.map((product, id) => {
                      const productLink = getPathWithCountryCode(
                        countryCode,
                        product.path
                      );
                      return (
                        <Grid
                          xs={12}
                          md={12}
                          lg={12}
                          key={`related-optional-product-${id}`}
                        >
                          <AnchorLink
                            gtm={{
                              id: "cta-click1",
                              label: product.name,
                              action: productLink
                            }}
                            href={productLink}
                          >
                            {product.name}
                          </AnchorLink>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Accordion.Details>
              )}
            </Accordion.Item>
          );
        })}
    </Accordion>
  );
};

export default SystemLayersSection;
