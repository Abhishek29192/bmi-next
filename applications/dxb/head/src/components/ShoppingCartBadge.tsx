import { Badge as MuiBadge, styled } from "@material-ui/core";
import React from "react";
import { ShoppingCartOutlined } from "@material-ui/icons";
import { Icon } from "@bmi/components";

type Props = {
  badgeCount: number;
};

const StyledBadge = styled(MuiBadge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: "-25%",
    top: "-50%",
    border: `1px solid ${theme.palette.background.paper}`,
    cursor: "default"
  }
}));

const ShoppingCartBadge = ({ badgeCount }: Props) => {
  return (
    <StyledBadge badgeContent={badgeCount} overlap="rectangular" color="error">
      <Icon source={ShoppingCartOutlined} />
    </StyledBadge>
  );
};

export default ShoppingCartBadge;
