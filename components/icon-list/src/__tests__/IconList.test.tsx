import React from "react";
import { render } from "@testing-library/react";
import IconList from "../";
import UserIcon from "@material-ui/icons/Person";

describe("IconList component", () => {
  it("renders correctly with default icon", () => {
    const { container } = render(
      <IconList>
        <IconList.Item title="Title">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum qui
          quas rem. Animi doloremque veniam numquam at deleniti quas fuga,
          similique minus magni cum nihil, in sed neque, tempore adipisci.
        </IconList.Item>
      </IconList>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with multiple children", () => {
    const { container } = render(
      <IconList>
        <IconList.Item
          icon={<UserIcon />}
          title="BMI Group sells to dealers, as well as professional customers."
        >
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est esse
          itaque consequatur laboriosam nisi perspiciatis, excepturi eaque
          delectus rerum maxime vitae minus error ipsam suscipit totam ab
          voluptates accusamus quia.
        </IconList.Item>
        <IconList.Item
          icon={<UserIcon />}
          title="BMI Group sells to dealers, as well as professional customers."
        >
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </IconList.Item>
        <IconList.Item
          icon={<UserIcon />}
          title="BMI Group sells to dealers, as well as professional customers."
        >
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est esse
          itaque consequatur laboriosam nisi perspiciatis, excepturi eaque
          delectus rerum maxime vitae minus error ipsam suscipit totam ab
          voluptates accusamus quia.
        </IconList.Item>
        <IconList.Item
          icon={<UserIcon />}
          title="BMI Group sells to dealers, as well as professional customers."
        >
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </IconList.Item>
      </IconList>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
