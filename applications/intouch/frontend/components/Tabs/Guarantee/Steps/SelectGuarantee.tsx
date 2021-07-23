import React from "react";
import { Box } from "@material-ui/core";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { BMI } from "@bmi/logo";
import Button from "@bmi/button";
import Tooltip from "@bmi/tooltip";
import { GuaranteeType } from "@bmi/intouch-api-types";

export type SelectGuarantees = {
  guaranteeType: GuaranteeType;
  status: boolean;
  message: string;
};

type SelectGuaranteeProps = {
  guarantees: SelectGuarantees[];
};

export const SelectGuarantee = ({ guarantees }: SelectGuaranteeProps) => {
  return (
    <div>
      {guarantees.map((guarantee, index) => (
        <Tooltip
          title={guarantee.message}
          key={guarantee.guaranteeType.name}
          style={{ padding: "5px" }}
        >
          <div className="guarantee">
            <Button
              key={guarantee.guaranteeType.name}
              variant="outlined"
              style={{ display: "block", width: "100%" }}
              disabled={!guarantee.status}
            >
              <Box
                key={index}
                bgcolor="white"
                borderColor="#CCCCCC"
                display="flex"
                m="3px"
              >
                <Icon
                  source={BMI}
                  style={{ width: 50, display: "block", padding: "6px" }}
                />
                <div>
                  <Typography variant="h6" color="primary">
                    {guarantee.guaranteeType.displayName}
                  </Typography>
                  <Typography variant="subtitle1">
                    {guarantee.guaranteeType.name}
                  </Typography>
                </div>
              </Box>
            </Button>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
