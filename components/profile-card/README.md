A card component to show user profiles.

## Variants

### Default

```jsx
import demoProfilePicture from "./images/stallman.png";
import { Email, Phone } from "@material-ui/icons";
import { useRef, useEffect } from "react";

<ProfileCard
  imageSource={demoProfilePicture}
  body={<ProfileCard.Body name="Richard Stallman" title="Code Wizard" />}
>
  <ProfileCard.Row action={{ model: "htmlLink", href: "/" }} icon={Email}>
    Fjellhamarveien 52, 1472, Fjellhamar
  </ProfileCard.Row>
  <ProfileCard.Row icon={Phone}>67 97 90 00</ProfileCard.Row>
  <ProfileCard.Row action={{ model: "htmlLink", href: "/" }} icon={Email}>
    kundeservice.no@bmigroup.com
  </ProfileCard.Row>
</ProfileCard>;
```
