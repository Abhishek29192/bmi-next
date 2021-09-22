import React from "react";
import Grid from "@bmi/grid";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
import { Product } from "../../components/types/ProductBaseTypes";
import { useSiteContext } from "../../components/Site";
import { SystemLayer } from "./types";

type Props = {
  systemLayers: SystemLayer[];
};

const createLinkAction = (product: Product, countryCode: string) => ({
  model: "htmlLink",
  href: "/" + countryCode + "/" + product.variantOptions[0].path
});

const SystemLayersSection = ({ systemLayers }: Props) => {
  const { getMicroCopy, countryCode } = useSiteContext();

  return (
    <Accordion>
      {systemLayers &&
        systemLayers
          .filter((layer) => layer?.relatedProducts[0])
          .sort((a, b) => a.layerNumber - b.layerNumber)
          .map((layer, index) => {
            const [mandatoryProduct] = layer.relatedProducts;

            return (
              <Accordion.Item key={`sdp-system-layer-accordion-item-${index}`}>
                <Accordion.Summary>
                  <Typography variant="default">
                    {`${layer.layerNumber}. ${layer.type}: ${layer.name || ""}`}
                  </Typography>
                </Accordion.Summary>

                <Accordion.Details>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                      <AnchorLink
                        action={createLinkAction(mandatoryProduct, countryCode)}
                      >
                        {mandatoryProduct.name}
                      </AnchorLink>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12}>
                      <Typography variant="default">
                        {layer.shortDescription}
                      </Typography>
                    </Grid>

                    {layer.relatedOptionalProducts?.length > 0 && (
                      <Grid item xs={12} md={12} lg={12}>
                        <Typography variant="h5">
                          {getMicroCopy("sdp.optionalProductsTitle")}
                        </Typography>
                      </Grid>
                    )}

                    {layer.relatedOptionalProducts?.map((product, id) => (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        key={`related-optional-product-${id}`}
                      >
                        <AnchorLink
                          action={createLinkAction(product, countryCode)}
                        >
                          {product.name}
                        </AnchorLink>
                      </Grid>
                    ))}
                  </Grid>
                </Accordion.Details>
              </Accordion.Item>
            );
          })}
    </Accordion>
  );
};

export default SystemLayersSection;
