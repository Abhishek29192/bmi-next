This component uses context to be able to create a list of checkboxes and a dowload button.

## Variants

### Default

```jsx
import { DownloadListContext } from ".";

<DownloadList onChange={console.log}>
  <div>
    <DownloadList.Checkbox name="id-1" value={true} />
  </div>

  <div>
    <DownloadListContext.Consumer>
      {({ resetList }) => {
        return <button onClick={resetList}>Reset the list</button>;
      }}
    </DownloadListContext.Consumer>
  </div>

  <div>
    <DownloadList.Clear label="Clear" />
    <DownloadList.Button label="Download ({{count}})" onClick={console.log} />
  </div>
</DownloadList>;
```
