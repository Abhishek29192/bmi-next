import { DialogClassNameContext } from "@bmi-digital/components/dialog";
import ThemeProvider, {
  getTheme
} from "@bmi-digital/components/theme-provider";
import React, { createContext } from "react";
import { Theme } from "@mui/material/styles";
import { useConfig } from "../contexts/ConfigProvider";

export const BrandClassNameContext = createContext<string | null>(null);

const BRAND_STYLES: { [key: string]: string | undefined } = {
  AeroDek: "AeroDek",
  Awak: "AeroDek",
  Braas: "BrandRed",
  Bramac: "BrandRed",
  Coverland: "BrandRed",
  Esha: "BrandGreen",
  Everguard: "Purple",
  Monarflex: "RoyalBlue",
  Monarplan: "Purple",
  Monier: "BrandRed",
  Necoflex: "NavyBlue",
  Ormax: "BrandRed",
  Redland: "BrandRed",
  Sealoflex: "NavyBlue",
  Sunscape: "BrandRed",
  Vedag: "NavyBlue",
  Villas: "RoyalBlue",
  Wierer: "BrandRed",
  Wolfin: "BrandGreen",
  Zanda: "BrandRed",
  Klober: "BrandRed"
};

type NoBrandProps = {
  children: React.ReactNode;
};

type BrandProviderProps = {
  children: React.ReactNode;
  brand?: string | null;
};

const NoBrandComponent = ({ children }: NoBrandProps) => {
  return (
    <div className={""} data-testid="brand-colors-provider">
      {children}
    </div>
  );
};

const brandThemes: Record<string, Theme> = {
  AeroDek: getTheme((theme) => ({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.primary,
        main: theme.colours.slate,
        dark: theme.colours.charcoal
      }
    },
    colours: {
      ...theme.colours,
      accent300: theme.colours.storm,
      accent: theme.colours.slate,
      inter: theme.colours.slate,
      interDark: theme.colours.slate,
      focus: theme.colours.charcoal,
      focusDark: theme.colours.charcoal,
      secondary1: theme.colours.blue900,
      secondary2: theme.colours.blue300,
      secondary3: theme.colours.black,
      secondary4: theme.colours.cyan700
    }
  })),
  BrandRed: getTheme((theme) => ({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.primary,
        main: theme.colours.brandRedInter,
        dark: theme.colours.brandRedInterFocus
      }
    },
    colours: {
      ...theme.colours,
      accent300: theme.colours.brandRed300,
      accent: theme.colours.brandRed,
      inter: theme.colours.brandRedInter,
      interDark: theme.colours.brandRedInter,
      focus: theme.colours.brandRedInterFocus,
      focusDark: theme.colours.brandRedInterFocus,
      secondary1: theme.colours.orange400,
      secondary2: theme.colours.slate,
      secondary3: theme.colours.charcoal,
      secondary4: theme.colours.brandRedInter
    }
  })),
  BrandGreen: getTheme((theme) => ({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.primary,
        main: theme.colours.brandGreenInter,
        dark: theme.colours.brandGreenInterFocus
      }
    },
    colours: {
      ...theme.colours,
      accent300: theme.colours.brandGreen,
      accent: theme.colours.brandGreen,
      inter: theme.colours.brandGreenInter,
      interDark: theme.colours.brandGreenInter,
      focus: theme.colours.brandGreenInterFocus,
      focusDark: theme.colours.brandGreenInterFocus,
      secondary1: theme.colours.brandGreen,
      secondary2: theme.colours.slate,
      secondary3: theme.colours.charcoal,
      secondary4: theme.colours.brandGreenInter
    }
  })),
  Purple: getTheme((theme) => ({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.primary,
        main: theme.colours.purple,
        dark: theme.colours.purpleFocus
      }
    },
    colours: {
      ...theme.colours,
      accent300: theme.colours.purple300,
      accent: theme.colours.purple,
      inter: theme.colours.purple,
      interDark: theme.colours.cyan500,
      focus: theme.colours.purpleFocus,
      focusDark: theme.colours.cyan600,
      secondary1: theme.colours.purpleFocus,
      secondary2: theme.colours.slate,
      secondary3: theme.colours.charcoal,
      secondary4: theme.colours.blue800
    }
  })),
  RoyalBlue: getTheme((theme) => ({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.primary,
        main: theme.colours.royalBlue,
        dark: theme.colours.royalBlueFocus
      }
    },
    colours: {
      ...theme.colours,
      accent300: theme.colours.cyan400,
      accent: theme.colours.royalBlue,
      inter: theme.colours.royalBlue,
      interDark: theme.colours.cyan500,
      focus: theme.colours.royalBlueFocus,
      focusDark: theme.colours.cyan600,
      secondary1: theme.colours.royalBlueFocus,
      secondary2: theme.colours.blue800,
      secondary3: theme.colours.slate,
      secondary4: theme.colours.cyan700
    }
  })),
  NavyBlue: getTheme((theme) => ({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.primary,
        main: theme.colours.navyBlue,
        dark: theme.colours.navyBlueFocus
      }
    },
    colours: {
      ...theme.colours,
      accent300: theme.colours.cyan400,
      accent: theme.colours.navyBlue,
      inter: theme.colours.navyBlue,
      interDark: theme.colours.cyan500,
      focus: theme.colours.navyBlueFocus,
      focusDark: theme.colours.cyan600,
      secondary1: theme.colours.navyBlueFocus,
      secondary2: theme.colours.slate,
      secondary3: theme.colours.cyan700,
      secondary4: theme.colours.blue800
    }
  }))
};

const BrandProvider = ({ brand, children }: BrandProviderProps) => {
  const { isBrandProviderEnabled } = useConfig();
  if (!brand || !isBrandProviderEnabled) {
    return <NoBrandComponent>{children}</NoBrandComponent>;
  }

  // eslint-disable-next-line security/detect-object-injection
  const className = BRAND_STYLES[brand];

  // eslint-disable-next-line security/detect-object-injection
  const brandTheme = brandThemes[className];

  return (
    <BrandClassNameContext.Provider value={className}>
      <ThemeProvider theme={brandTheme}>
        <DialogClassNameContext.Provider value={className}>
          {children}
        </DialogClassNameContext.Provider>
      </ThemeProvider>
    </BrandClassNameContext.Provider>
  );
};

export default BrandProvider;
