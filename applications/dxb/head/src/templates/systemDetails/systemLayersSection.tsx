import React from "react";
import Grid from "@bmi-digital/components/grid";
import Accordion from "@bmi-digital/components/accordion";
import Typography from "@bmi-digital/components/typography";
import AnchorLink, {
  AnchorLinkProps
} from "@bmi-digital/components/anchor-link";
import { Product, SystemLayer } from "../../components/types/pim";
import { useSiteContext } from "../../components/Site";
import withGTM from "../../utils/google-tag-manager";
import { microCopy } from "../../constants/microCopies";

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
          .filter((layer) => layer.approvalStatus === "approved")
          .sort((a, b) => a.layerNumber - b.layerNumber)
          .map((layer, index) => {
            const relatedProduct = layer.relatedProducts?.[0];
            const productLinkAction =
              relatedProduct && createLinkAction(relatedProduct, countryCode);

            const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink, {
              label: "children"
            });

            const layerLabel = layer.type ? ` ${layer.type}:` : "";

            return (
              <Accordion.Item key={`sdp-system-layer-accordion-item-${index}`}>
                <Accordion.Summary>
                  <Typography variant="default">
                    {`${layer.layerNumber}.${layerLabel} ${layer.name || ""}`}
                  </Typography>
                </Accordion.Summary>

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

                    {layer.relatedOptionalProducts?.length > 0 && (
                      <Grid item xs={12} md={12} lg={12}>
                        <Typography variant="h5">
                          {getMicroCopy(microCopy.SDP_OPTIONAL_PRODUCTS_TITLE)}
                        </Typography>
                      </Grid>
                    )}

                    {layer.relatedOptionalProducts?.map((product, id) => {
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
