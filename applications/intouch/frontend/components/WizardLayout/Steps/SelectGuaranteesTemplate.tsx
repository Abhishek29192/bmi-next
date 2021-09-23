import React, { useEffect, useState } from "react";
import Select, { MenuItem } from "@bmi/select";
import { gql } from "@apollo/client";
import { useGetGuaranteeTemplatesLazyQuery } from "../../../graphql/generated/hooks";
import { GetGuaranteeTemplatesQuery } from "../../../graphql/generated/operations";
import { useWizardContext } from "../WizardContext";

const SelectGuaranteesTemplate = () => {
  const { data, setData } = useWizardContext();

  const {
    guaranteeType: { technology, coverage },
    guaranteeTemplate
  } = data;

  const [guaranteeTemplates, setGuaranteeTemplates] = useState<
    GetGuaranteeTemplatesQuery["guaranteeTemplateCollection"]["items"]
  >([]);

  const [getGuaranteeTemplates] = useGetGuaranteeTemplatesLazyQuery({
    onCompleted: ({ guaranteeTemplateCollection: { items: templates } }) => {
      if (templates.length > 0) {
        setGuaranteeTemplates(templates);
        if (!data?.guaranteeTemplate) {
          setData({
            ...data,
            guaranteeTemplate: templates[0]
          });
        }
      }
    }
  });

  const selectedTemplate = guaranteeTemplate?.sys?.id || "";

  useEffect(() => {
    getGuaranteeTemplates({
      variables: {
        technology: technology,
        coverage: coverage
      }
    });
  }, [technology, coverage]);

  const onChangeHandler = (templateId) => {
    const guaranteeTemplate = guaranteeTemplates.find(
      (item) => item.sys.id === templateId
    );
    setData({ ...data, guaranteeTemplate: guaranteeTemplate });
  };

  return (
    <div>
      {guaranteeTemplates.length > 0 && (
        <Select
          name="template"
          label="Language"
          isRequired
          style={{ margin: "10px" }}
          onChange={onChangeHandler}
          value={selectedTemplate || ""}
        >
          {guaranteeTemplates.map((template) => (
            <MenuItem value={template.sys.id} key={template.displayName}>
              {template.displayName}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
};

export default SelectGuaranteesTemplate;

export const GET_GUARANTEE_TEMPLATES = gql`
  query getGuaranteeTemplates(
    $technology: String!
    $coverage: String!
    $language: String
  ) {
    guaranteeTemplateCollection(
      where: {
        coverage: $coverage
        technology: $technology
        languageCode: $language
      }
    ) {
      items {
        sys {
          id
        }
        displayName
        languageCode
        coverage
      }
    }
  }
`;
