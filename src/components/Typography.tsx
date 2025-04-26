import React, { ReactNode } from "react";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

// Set up the fonts
const ibmPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

// Define the variants and their respective styles
export type TypographyVariant =
  | "pageTitle"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "small";

// Define the font family options
export type FontFamily = "sans" | "mono";

// Define font weight options
export type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";

// Define common props that apply to all typography elements
export interface TypographyProps {
  variant?: TypographyVariant;
  component?: React.ElementType; // Allows specifying a different HTML element than the default for variant
  fontFamily?: FontFamily;
  fontWeight?: FontWeight;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  noWrap?: boolean;
  gutterBottom?: boolean;
  className?: string;
  children: ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body1",
  component,
  fontFamily = "sans",
  fontWeight,
  color,
  align = "left",
  noWrap = false,
  gutterBottom = false,
  className = "",
  children,
  ...props
}) => {
  // Default element mapping based on variant
  const getElementType = (): React.ElementType => {
    // If a component prop is provided, use it instead of the default
    if (component) {
      return component;
    }

    // Default mapping
    switch (variant) {
      case "pageTitle":
        return "h1";
      case "h1":
        return "h1";
      case "h2":
        return "h2";
      case "h3":
        return "h3";
      case "h4":
        return "h4";
      case "h5":
        return "h5";
      case "h6":
        return "h6";
      case "small":
        return "small";
      case "body1":
        return "p";
      case "body2":
        return "p";
      default:
        return "p";
    }
  };

  // Tailwind classes based on variant
  const getVariantClasses = (): string => {
    switch (variant) {
      case "pageTitle":
        return "text-5xl md:text-6xl lg:text-7xl font-light leading-tight";
      case "h1":
        return "text-4xl md:text-5xl lg:text-6xl font-light leading-tight";
      case "h2":
        return "text-3xl font-light leading-tight";
      case "h3":
        return "text-2xl font-normal leading-tight";
      case "h4":
        return "text-xl font-normal leading-tight";
      case "h5":
        return "text-lg font-normal leading-tight";
      case "h6":
        return "text-base font-medium leading-tight";
      case "body1":
        return "text-base font-normal leading-relaxed";
      case "body2":
        return "text-sm font-normal leading-relaxed";
      case "small":
        return "text-xs font-normal leading-relaxed";
      default:
        return "text-base font-normal leading-relaxed";
    }
  };

  // Font family classes
  const getFontFamilyClass = (): string => {
    return fontFamily === "mono"
      ? ibmPlexMono.className
      : ibmPlexSans.className;
  };

  // Font weight classes
  const getFontWeightClass = (): string => {
    // If fontWeight is explicitly provided, use it; otherwise, keep the default from variant
    if (!fontWeight) return "";

    switch (fontWeight) {
      case "light":
        return "!font-light";
      case "normal":
        return "!font-normal";
      case "medium":
        return "!font-medium";
      case "semibold":
        return "!font-semibold";
      case "bold":
        return "!font-bold";
      default:
        return "";
    }
  };

  // Alignment classes
  const getAlignmentClasses = (): string => {
    switch (align) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      default:
        return "text-left";
    }
  };

  // Custom color style if needed
  const colorStyle = color ? { color } : {};

  // Combined classes
  const combinedClasses = [
    getVariantClasses(),
    getFontFamilyClass(),
    getFontWeightClass(),
    getAlignmentClasses(),
    noWrap ? "whitespace-nowrap overflow-hidden text-ellipsis" : "",
    gutterBottom ? "mb-2" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Element = getElementType();

  return (
    <Element className={combinedClasses} style={colorStyle} {...props}>
      {children}
    </Element>
  );
};

// Export the font variables for use in other components if needed
export { ibmPlexSans, ibmPlexMono };

export default Typography;
