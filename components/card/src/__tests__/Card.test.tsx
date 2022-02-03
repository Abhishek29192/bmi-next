import React from "react";
import { render } from "@testing-library/react";
import Card from "../";
import {
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CardActionArea
} from "../";

describe("Card component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Card>
        <CardHeader title="test title" subheader="test subheader" />
        <CardActionArea>
          <CardMedia component="img" height="140" image="" alt="green iguana" />
          <CardContent>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde, eos!
          </CardContent>
        </CardActionArea>
        <CardActions>
          <button>Share</button>
        </CardActions>
      </Card>
    );
    expect(container).toMatchSnapshot();
  });
});
