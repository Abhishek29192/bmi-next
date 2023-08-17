import { Button } from "@bmi-digital/components";
import classnames from "classnames";
import React from "react";
import {
  StyledContainer,
  StyledFooter,
  StyledLogo,
  StyledLink,
  StyledListItem,
  StyledList
} from "./styles/FooterStyles";

type MenuItem = {
  label: string;
  action: {
    model: string;
    href: string;
  };
};

const NavigationItem = ({ label, icon, isLabelHidden, action }: any) => {
  const IconComponent = icon;

  return (
    <StyledListItem className={classnames(isLabelHidden)}>
      {isLabelHidden ? (
        <Button
          isIconButton
          accessibilityLabel={label}
          variant="text"
          hasDarkBackground
          action={action}
        >
          <IconComponent />
        </Button>
      ) : (
        <StyledLink
          startIcon={icon ? <IconComponent /> : undefined}
          hasDarkBackground
          variant="text"
          action={action}
        >
          {label}
        </StyledLink>
      )}
    </StyledListItem>
  );
};

const BmiFooter = ({ menu }: { menu: MenuItem[] }) => {
  return (
    <StyledFooter>
      <StyledContainer>
        <a href="http://www.icopal.co.uk/">
          <StyledLogo />
        </a>
        {menu && menu.length && (
          <StyledList>
            {menu.map((menuItem, index) => (
              <NavigationItem key={index} {...menuItem} />
            ))}
          </StyledList>
        )}
      </StyledContainer>
    </StyledFooter>
  );
};

export default BmiFooter;
