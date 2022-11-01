import React from "react";
import Icon, {
  Arrow,
  Cross,
  Download,
  External,
  Facebook,
  FileJPEG,
  FileJPG,
  FilePDF,
  FilePNG,
  HardHatHead,
  LinkedIn,
  LocationOn,
  Mail,
  Phone,
  PhoneMobile,
  PlayArrow,
  QuestionMark,
  SelectRoof,
  SelectTile,
  SelectWallColour,
  TileColour,
  User,
  YouTube
} from "../index";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Icon component", () => {
  it("renders Arrow correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={Arrow} />);
    expect(container).toMatchSnapshot();
  });
  it("renders Download correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={Download} />);
    expect(container).toMatchSnapshot();
  });
  it("renders Facebook correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={Facebook} />);
    expect(container).toMatchSnapshot();
  });
  it("renders LinkedIn correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={LinkedIn} />);
    expect(container).toMatchSnapshot();
  });
  it("renders Mail correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={Mail} />);
    expect(container).toMatchSnapshot();
  });
  it("renders Phone correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={Phone} />);
    expect(container).toMatchSnapshot();
  });
  it("renders PhoneMobile correctly", () => {
    const { container } = renderWithThemeProvider(
      <Icon source={PhoneMobile} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders QuestionMark correctly", () => {
    const { container } = renderWithThemeProvider(
      <Icon source={QuestionMark} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders User correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={User} />);
    expect(container).toMatchSnapshot();
  });
  it("renders YouTube correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={YouTube} />);
    expect(container).toMatchSnapshot();
  });
  it("renders FileJPEG correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={FileJPEG} />);
    expect(container).toMatchSnapshot();
  });
  it("renders FileJPG correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={FileJPG} />);
    expect(container).toMatchSnapshot();
  });
  it("renders FilePDF correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={FilePDF} />);
    expect(container).toMatchSnapshot();
  });
  it("renders FilePNG correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={FilePNG} />);
    expect(container).toMatchSnapshot();
  });
  it("renders Cross correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={Cross} />);
    expect(container).toMatchSnapshot();
  });
  it("renders External correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={External} />);
    expect(container).toMatchSnapshot();
  });
  it("renders HardHatHead correctly", () => {
    const { container } = renderWithThemeProvider(
      <Icon source={HardHatHead} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders LocationOn correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={LocationOn} />);
    expect(container).toMatchSnapshot();
  });
  it("renders PlayArrow correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={PlayArrow} />);
    expect(container).toMatchSnapshot();
  });
  it("renders TileColour correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={TileColour} />);
    expect(container).toMatchSnapshot();
  });
  it("renders SelectRoof correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={SelectRoof} />);
    expect(container).toMatchSnapshot();
  });
  it("renders SelectTile correctly", () => {
    const { container } = renderWithThemeProvider(<Icon source={SelectTile} />);
    expect(container).toMatchSnapshot();
  });
  it("renders SelectWallColour correctly", () => {
    const { container } = renderWithThemeProvider(
      <Icon source={SelectWallColour} />
    );
    expect(container).toMatchSnapshot();
  });
});
