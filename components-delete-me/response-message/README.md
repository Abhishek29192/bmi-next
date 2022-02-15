This component contains an icon, title and children and displays an outcome or message to the user.

## Variants

### Success

```jsx
import { Icon } from "@bmi-digital/components";
import EmailIcon from "@material-ui/icons/Email";
import { Typography } from "@bmi-digital/components";

<ResponseMessage title="Thank you!" icon={EmailIcon}>
  <Typography style={{ padding: "10px 0" }}>
    Your email has been sent.
  </Typography>
  <Typography style={{ padding: "10px 0" }}>
    We&apos;ll get back to you as soon as we can.
  </Typography>
</ResponseMessage>;
```

### Error

```jsx
import { Icon } from "@bmi-digital/components";
import WarningIcon from "@material-ui/icons/Warning";
import { Typography } from "@bmi-digital/components";

<ResponseMessage title="Error" icon={WarningIcon} error>
  <Typography style={{ padding: "10px 0" }}>
    There was a problem sending your email.
  </Typography>
  <Typography style={{ padding: "10px 0" }}>
    Please try again and contact support if your issue can't be resolved.
  </Typography>
</ResponseMessage>;
```
