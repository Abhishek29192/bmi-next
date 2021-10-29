import React, { useState, useRef } from "react";
import { gql } from "@apollo/client";
import { System, Technology } from "@bmi/intouch-api-types";
import { useSearchSystemsLazyQuery } from "../../../graphql/generated/hooks";
import {
  WizardAutoComplete,
  WizardAutoCompleteOptions,
  WizardAutoCompleteItem
} from "../WizardAutoComplete";
import { useWizardContext } from "../WizardContext";
import { WizardSystemDetailCard } from "../WizardSystemDetailCard";

const SelectSystem = () => {
  const debouncer = useRef<NodeJS.Timeout>();
  const { data, setData } = useWizardContext();
  const [options, setOptions] = useState<WizardAutoCompleteOptions>({
    totalCount: 0,
    items: []
  });
  const [systems, setSystems] = useState<System[]>();

  const [systemsSearch] = useSearchSystemsLazyQuery({
    fetchPolicy: "cache-and-network",
    onCompleted: ({ searchSystems: { totalCount, nodes } }) => {
      setSystems(nodes as System[]);
      const systems = {
        totalCount,
        items: nodes.map(({ id, name, description }) => ({
          id,
          name,
          description
        }))
      };
      setOptions(systems);
    }
  });
  const [value, setValue] = useState<WizardAutoCompleteItem>(null);

  const handleChange = (value: WizardAutoCompleteItem) => {
    const selectedSystem = value
      ? systems.find((system) => system.id === value.id)
      : null;
    setData({
      ...data,
      system: selectedSystem
    });

    setValue(value);
  };
  const handleInput = async (input: string) => {
    setOptions({
      totalCount: 0,
      items: []
    });
    if (input.length > 0) {
      systemsSearch({
        variables: {
          query: input,
          technology: data.guaranteeType.technology as Technology
        }
      });
    }
  };

  const { system } = data;

  return (
    <div>
      <WizardAutoComplete
        options={options}
        value={value}
        onChange={handleChange}
        onInputChange={(input) => {
          debouncer.current && clearTimeout(debouncer.current);
          debouncer.current = setTimeout(() => handleInput(input), 500);
        }}
      />
      {system && (
        <WizardSystemDetailCard
          name={system.name}
          description={system.description}
          products={system.systemMembersBySystemBmiRef.nodes?.map(
            ({ productByProductBmiRef }) => productByProductBmiRef
          )}
          onDeleteClick={() => {
            handleChange(null);
          }}
        />
      )}
    </div>
  );
};

export const GET_GUARANTEE_SYSTEM = gql`
  query searchSystems($query: String!, $technology: Technology!) {
    searchSystems(query: $query, technology: $technology, first: 20) {
      totalCount
      nodes {
        id
        technology
        name
        description
        bmiRef
        systemMembersBySystemBmiRef {
          nodes {
            id
            productByProductBmiRef {
              id
              name
              family
              brand
            }
          }
        }
      }
    }
  }
`;

export default SelectSystem;
