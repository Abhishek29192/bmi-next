import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Product,
  System,
  ProductsConnection,
  SystemsConnection
} from "@bmi/intouch-api-types";
import TextField from "@bmi/text-field";
import Typography from "@bmi/typography";
import Tabs from "@bmi/tabs";
import Form from "@bmi/form";
import Grid from "@bmi/grid";
import Button from "@bmi/button";
import { initializeApollo } from "../../lib/apolloClient";
import { getAuth0Instance } from "../../lib/auth0";
import { SidePanel } from "../../components/SidePanel";
import { FilterResult } from "../../components/FilterResult";
import { Layout } from "../../components/Layout";
import { withLogger } from "../../lib/logger/withLogger";
import {
  useBulkImportMutation,
  useProductsAndSystemsLazyQuery,
  useUpdateProductMutation,
  useUpdateSystemMutation
} from "../../graphql/generated/hooks";
import { getServerPageProductsAndSystems } from "../../graphql/generated/page";

const ProductImport = () => {
  const { t } = useTranslation();

  const [products, setProducts] = useState<Partial<ProductsConnection>>();
  const [systems, setSystems] = useState<Partial<SystemsConnection>>();

  const [filesToUpload, setFilesToUpload] = useState<FileList>();
  const [importResult, setImportResult] = useState<any>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedSystem, setSelectedSystem] = useState<System>();

  const [getProductAndSystem] = useProductsAndSystemsLazyQuery({
    fetchPolicy: "network-only",
    onCompleted: ({ products, systems }) => {
      setProducts(products as ProductsConnection);
      setSystems(systems as SystemsConnection);
    }
  });
  const [bulkImport] = useBulkImportMutation({
    onCompleted: () => getProductAndSystem(),
    onError: (error) => {
      alert(error);
    }
  });
  const [udpateProduct] = useUpdateProductMutation({
    onCompleted: () => getProductAndSystem()
  });
  const [updateSystem] = useUpdateSystemMutation({
    onCompleted: () => getProductAndSystem()
  });

  useEffect(() => {
    getProductAndSystem();
  }, []);

  const submit = async (dryRun: boolean) => {
    if (filesToUpload) {
      const { data } = await bulkImport({
        variables: {
          input: {
            files: filesToUpload as unknown as any[],
            dryRun
          }
        }
      });

      if (data) {
        setImportResult({
          ...data.bulkImport,
          message: dryRun ? "Dry run completed" : "Import completed"
        });
      }
    }
  };

  const onProductChange = (name, value) =>
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: value
    }));

  const onSystemChange = (name, value) =>
    setSelectedSystem((prev) => ({
      ...prev,
      [name]: value
    }));

  const onProductSubmit = (event) => {
    event.preventDefault();
    const { id, __typename, ...rest } = selectedProduct;
    udpateProduct({
      variables: {
        input: {
          id,
          patch: {
            ...rest
          }
        }
      }
    });
  };
  const onSystemSubmit = (event) => {
    event.preventDefault();
    const { id, __typename, ...rest } = selectedSystem;
    updateSystem({
      variables: {
        input: {
          id,
          patch: {
            ...rest
          }
        }
      }
    });
  };

  const renderListOfProduct = (label, list) =>
    list?.length > 0 && (
      <>
        <Typography variant="h6">{label}</Typography>
        {list.map((item, index) => (
          <Typography key={`index-${index}`} variant="body1">
            {item.bmiRef}
          </Typography>
        ))}
      </>
    );

  return (
    <Layout title="Product Import">
      <Tabs initialValue="one">
        <Tabs.TabPanel heading="Bulk import" index="one">
          <div style={{ padding: 12 }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography>
                  Please upload the files containing the
                  <br />
                  products/systems/system_members with this format:
                  <br />
                  [env]-[market]-[product/system/system_member].csv
                </Typography>
                <div style={{ marginTop: 30 }}>
                  <input
                    type="file"
                    multiple
                    onChange={({ target: { files } }) => {
                      setFilesToUpload(files);
                    }}
                  />
                  <Button onClick={() => submit(true)}>Dry run</Button>
                </div>
              </Grid>
              <Grid item xs={6}>
                {renderListOfProduct(
                  "System to update",
                  importResult?.systemsToUpdate
                )}
                {renderListOfProduct(
                  "Product to update",
                  importResult?.productsToUpdate
                )}
                {renderListOfProduct(
                  "System to insert",
                  importResult?.systemsToInsert
                )}
                {renderListOfProduct(
                  "Product to insert",
                  importResult?.productsToInsert
                )}

                {importResult && (
                  <Button
                    style={{ marginTop: 15 }}
                    onClick={() => submit(false)}
                  >
                    Submit
                  </Button>
                )}

                {importResult?.message && (
                  <Typography>{importResult.message}</Typography>
                )}
              </Grid>
            </Grid>
          </div>
        </Tabs.TabPanel>
        <Tabs.TabPanel heading="Products" index="two">
          <div style={{ display: "flex" }}>
            <SidePanel key="list-products">
              {products?.nodes.map((product, index) => (
                <div
                  key={`product-${index}`}
                  onClick={(e) => setSelectedProduct(product)}
                >
                  <FilterResult label={product.bmiRef} key={product.bmiRef}>
                    <Typography>{product.name}</Typography>
                  </FilterResult>
                </div>
              ))}
            </SidePanel>
            {selectedProduct && (
              <Form
                key="form-product"
                onSubmit={onProductSubmit}
                style={{ width: "100%" }}
              >
                <div style={{ padding: 12 }}>
                  <Grid container spacing={3}>
                    {["name", "brand"].map((key) => (
                      <Grid key={key} item xs={12}>
                        <TextField
                          name={key}
                          label={t(key)}
                          fullWidth
                          value={selectedProduct[key]}
                          onChange={(value) => onProductChange(key, value)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
                <Form.ButtonWrapper>
                  <Form.SubmitButton>Save</Form.SubmitButton>
                </Form.ButtonWrapper>
              </Form>
            )}
          </div>
        </Tabs.TabPanel>
        <Tabs.TabPanel heading="System" index="three">
          <div style={{ display: "flex" }}>
            <SidePanel key="list-systems">
              {systems?.nodes.map((system, index) => (
                <div
                  key={`product-${index}`}
                  onClick={(e) => setSelectedSystem(system)}
                >
                  <FilterResult label={system.bmiRef} key={system.bmiRef}>
                    <Typography>{system.name}</Typography>
                  </FilterResult>
                </div>
              ))}
            </SidePanel>
            {selectedSystem && (
              <div style={{ padding: 12 }}>
                <Form
                  key="list-form"
                  onSubmit={onSystemSubmit}
                  style={{ width: "100%" }}
                >
                  <Grid container spacing={3}>
                    {["name", "description"].map((key) => (
                      <Grid key={key} item xs={12}>
                        <TextField
                          key={`system-${key}`}
                          name={key}
                          label={t(key)}
                          fullWidth
                          value={selectedSystem[key]}
                          onChange={(value) => onSystemChange(key, value)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Form.ButtonWrapper>
                    <Form.SubmitButton>Save</Form.SubmitButton>
                  </Form.ButtonWrapper>
                </Form>
              </div>
            )}
          </div>
        </Tabs.TabPanel>
      </Tabs>
    </Layout>
  );
};

export const getServerSideProps = withLogger(async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps({ req, res, locale }) {
      const apolloClient = await initializeApollo(null, { ...ctx, locale });

      const {
        props: { data }
      } = await getServerPageProductsAndSystems(
        {
          variables: {}
        },
        apolloClient
      );

      return {
        props: {
          ...(await serverSideTranslations(locale, [
            "common",
            "sidebar",
            "footer"
          ])),
          ...data
        }
      };
    }
  })(ctx);
});

// export doesn't matter for codegen
export const pageQuery = gql`
  query ProductsAndSystems {
    products {
      nodes {
        id
        bmiRef
        family
        name
        brand
        published
        description
        brand
      }
    }
    systems {
      nodes {
        id
        bmiRef
        description
        name
        published
      }
    }
  }
`;

export const uploadProducts = gql`
  mutation bulkImport($input: BulkImportInput!) {
    bulkImport(input: $input) {
      systemsToInsert {
        bmiRef
      }
      systemsToUpdate {
        bmiRef
      }
      productsToInsert {
        bmiRef
      }
      productsToUpdate {
        bmiRef
      }
    }
  }
`;

export const updateProduct = gql`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        id
      }
    }
  }
`;

export const updateSystem = gql`
  mutation updateSystem($input: UpdateSystemInput!) {
    updateSystem(input: $input) {
      system {
        id
      }
    }
  }
`;

export default withPageAuthRequired(ProductImport);
