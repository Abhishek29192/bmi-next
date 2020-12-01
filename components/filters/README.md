Visual component for selecting product filters.

## Variants

### Default

The component is fully controlled, meaning it does not hold internal state. See examples of how to manage that.

This component also leaves up to interpretation the integration concern of identifying which filter options should be enabled depending on the results of a query, for example to not enable a user to chose a combination that would lead to 0 results.

> NOTE: The default functionality of accordions being open when they have selected values has been temporarily disabled, until that functionality can be integrated.

```jsx
const filters = [
  {
    label: "Product Type",
    name: "product",
    value: ["tiles"],
    options: [
      {
        label: "Tiles",
        value: "tiles"
      },
      {
        label: "Covers",
        value: "covers"
      }
    ]
  },
  {
    label: "Colour",
    name: "color",
    options: [
      {
        label: "Black",
        value: "black"
      },
      {
        label: "Grey",
        value: "grey",
        isDisabled: true
      }
    ]
  }
];

const [state, setState] = React.useState(filters);

const handleCheckboxChange = (filterName, filterValue, checked) => {
  const addToArray = (array, value) => [...array, value];
  const removeFromArray = (array, value) => array.filter((v) => v !== value);
  const getNewValue = (filter, checked, value) => {
    return checked
      ? addToArray(filter.value || [], filterValue)
      : removeFromArray(filter.value || [], filterValue);
  };

  const newState = state.map((filter) => {
    return {
      ...filter,
      value:
        filter.name === filterName
          ? getNewValue(filter, checked, filterValue)
          : filter.value
    };
  });

  setState(newState);
};

<Filters filters={state} onChange={handleCheckboxChange} />;
```
