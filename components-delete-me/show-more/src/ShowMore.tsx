import { ButtonProps, IconButtonProps } from "@bmi-digital/components";
import React, { useState } from "react";

type ShowMoreProps = {
  openButton: React.ReactElement<ButtonProps | IconButtonProps>;
  closeButton?: React.ReactElement<ButtonProps | IconButtonProps>;
  children: React.ReactNode;
  isExpanded?: boolean;
};

const ShowMore = ({
  openButton,
  closeButton,
  children,
  isExpanded
}: ShowMoreProps) => {
  const [toggle, setToggle] = useState(isExpanded);
  const handleClick = () => setToggle(!toggle);
  const toggleButton = React.cloneElement(openButton, {
    onClick: handleClick
  });
  const closeToggleButton = closeButton
    ? React.cloneElement(closeButton, { onClick: handleClick })
    : toggleButton;

  return (
    <div>
      <div>{toggle && children}</div>
      {!toggle && toggleButton}
      {toggle && closeToggleButton}
    </div>
  );
};

export default ShowMore;
