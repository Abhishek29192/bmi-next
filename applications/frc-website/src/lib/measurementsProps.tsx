import { Typography } from "@bmi-digital/components";
import React from "react";
import details1 from "../images/details1.jpeg";
import details2 from "../images/details2.jpeg";
import fieldArea1 from "../images/fieldArea1.jpg";
import fieldArea2 from "../images/fieldArea2.jpg";
import fieldArea3 from "../images/fieldArea3.jpg";
import kerb from "../images/kerb.jpeg";
import upstand from "../images/upstand.jpeg";

const imgStyle = { width: "100%" };
const smallImgStyle = { width: "100%", padding: 50 };

export const measurementsProps = {
  header: "Your roofing measurements",
  help: {
    fieldArea: (
      <>
        <img src={fieldArea1} style={smallImgStyle} alt={"Diagram of area 1"} />
        <Typography>
          <b>
            Area m<sup>2</sup> = side 1 x side 2
          </b>
          <br />
          Multiply side 1 by side 2 to obtain your area in square meter/foot
        </Typography>
        <img src={fieldArea2} style={smallImgStyle} alt={"Diagram of area 2"} />
        <Typography>
          <b>
            Area A m<sup>2</sup>= side 1 x side 2
          </b>
          <br />
          Multiply side 1 by side 2 to obtain your area in square meter/foot
          <br />
          <br />
          <b>
            Area B m<sup>2</sup>= side 3 x side 4
          </b>
          <br />
          Multiply side 3 by side 4 to obtain your area in square meter/foot
          <br />
          <br />
          <b>
            Total Area m<sup>2</sup> = Area A + Area B
          </b>
          <br />
          Combine all areas to obtain your total area in square meter/foot
          <br />
          <br />
        </Typography>
        <img src={fieldArea3} style={smallImgStyle} alt={"Diagram of area 3"} />
        <Typography>
          <b>
            Area A m<sup>2</sup>= side 1 x side 2
          </b>
          <br />
          Multiply side 1 by side 2 to obtain your area in square meter/foot
          <br />
          <br />
          <b>
            Area B m<sup>2</sup>= side 3 x side 4
          </b>
          <br />
          Multiply side 3 by side 4 and then divide by 2 t to obtain your area
          in square meter/foot
          <br />
          <br />
          <b>
            Total Area m<sup>2</sup> = Area A + Area B
          </b>
          <br />
          Combine all areas to obtain your total area in square meter/foot
        </Typography>
      </>
    ),
    upstand: <img src={upstand} style={imgStyle} alt={"Example of upstand"} />,
    kerb: <img src={kerb} style={imgStyle} alt={"Example of kerb"} />,
    details: (
      <>
        <img
          src={details1}
          style={{ ...imgStyle, marginBottom: 36 }}
          alt={"Diagram of gutter details"}
        />
        <img
          src={details2}
          style={imgStyle}
          alt={"Diagram of kerb penetration"}
        />
      </>
    )
  }
};
