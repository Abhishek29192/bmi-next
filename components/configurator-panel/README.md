An accordion component used to create a System Configurator in conjunction with the RadioPane component to compose question and answer blocks.

## Variants

### Default

```jsx
<ConfiguratorPanel title="Panel One">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend elit
  vitae velit dignissim blandit.
</ConfiguratorPanel>
```

### Controlled

```jsx
<ConfiguratorPanel title="Panel One" expanded={true} disabled={true}>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend elit
  vitae velit dignissim blandit.
</ConfiguratorPanel>
```

### Mock System Configurator block example

```jsx
import RadioPane from "@bmi/radio-pane";
import { useState } from "react";

const answers = [
  {
    id: "answer1",
    title: "Answer One",
    name: "answers",
    value: "answer1"
  },
  {
    id: "answer2",
    title: "Answer Two",
    name: "answers",
    value: "answer2"
  }
];

const SystemConfigurator = () => {
  const [selected, setSelected] = useState(null);

  return (
    <ConfiguratorPanel
      title="Question One"
      {...(selected && { selectedOptionTitle: selected.title })}
      options={answers.map((answer) => (
        <RadioPane
          key={answer.id}
          {...answer}
          onClick={() => setSelected(answer)}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </RadioPane>
      ))}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend
      elit vitae velit dignissim blandit.
    </ConfiguratorPanel>
  );
};

<SystemConfigurator />;
```
