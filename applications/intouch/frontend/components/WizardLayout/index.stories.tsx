import React from "react";
import Typography from "@bmi/typography";
import TextField from "@bmi/text-field";
import { Search } from "@material-ui/icons";
import { Wizard } from ".";

export default {
  title: "Wizard Layout",
  component: Wizard
};

export const Basic = () => {
  return (
    <Wizard>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h3" style={{ marginBottom: "0.5rem" }}>
          System details
        </Typography>
        <Typography>Please select the system you would like to add</Typography>
        <TextField
          fullWidth
          id="search"
          name="Search"
          variant="outlined"
          label="Search..."
          rightAdornment={<Search />}
          style={{ backgroundColor: "#ffffff", marginTop: "3rem" }}
        />
      </div>
    </Wizard>
  );
};
