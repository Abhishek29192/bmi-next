import React from "react";
import Card, {
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia
} from "../Card";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Card component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
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
