import React, { ReactNode } from "react";

import clsx from "clsx";
import tinycolor from "tinycolor2";

import theme from "data/theme";
import { shadows } from "src/util/baseTheme";

interface ButtonProps {
  dark?: boolean;
  muted?: boolean;
  color: string;
  iconColor?: string;
  backgroundColor?: string;
  flat?: boolean;
  left?: boolean;
  sm?: boolean;
  icon?: ReactNode;
  href: string;
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  dark = false,
  muted = false,
  color,
  iconColor,
  backgroundColor,
  flat = false,
  left = false,
  sm = false,
  icon,
  href,
  children,
}) => {
  let textColor: string;
  if (color.split(".").length > 1) {
    // Format: "green.600"
    textColor = theme.colors[color.split(".")[0]][color.split(".")[1]];
  } else {
    // Format: "black", "white", ou couleur hex directe
    textColor = theme.colors[color] as string || color;
  }

  // Debug temporaire
  console.log(`Button color: "${color}" -> resolved to: "${textColor}"`);

  let iconColorValue: string;
  if (iconColor) {
    if (iconColor.split(".").length > 1) {
      // Format: "green.600"
      iconColorValue = theme.colors[iconColor.split(".")[0]][iconColor.split(".")[1]];
    } else {
      // Format: "black", "white", ou couleur hex directe
      iconColorValue = theme.colors[iconColor] as string || iconColor;
    }
    console.log(`Button iconColor: "${iconColor}" -> resolved to: "${iconColorValue}"`);
  } else {
    iconColorValue = textColor; // Par défaut, l'icône a la même couleur que le texte
  }

  let bgColor: string;
  if (backgroundColor) {
    if (backgroundColor.split(".").length > 1) {
      // Format: "green.600"
      bgColor = theme.colors[backgroundColor.split(".")[0]][backgroundColor.split(".")[1]];
    } else {
      // Format: "black", "white", ou couleur hex directe
      bgColor = theme.colors[backgroundColor] as string || backgroundColor;
    }
    console.log(`Button backgroundColor: "${backgroundColor}" -> resolved to: "${bgColor}"`);
  } else {
    // Arrière-plan par défaut basé sur dark et muted
    bgColor = !muted ? (dark ? "#111827" : "#f9fafb") : dark ? "#f9fafb" : "#111827";
  }

  return (
    <>
      <a className={clsx("btn", sm && "sm")} href={href} rel="noopener noreferrer" target={"_blank"}>
        {icon && <div className={"icon"}>{icon}</div>}
        {children}
      </a>
      <style jsx>{`
        a {
          text-align: ${left ? "left" : "center"};
          background: ${bgColor};
          color: ${textColor};
          border: ${muted ? `1px solid ${dark ? "#e5e7eb" : "#374151"}` : "none"};
          box-shadow: ${flat ? "none" : shadows.sm};
        }

        a:hover {
          background: ${backgroundColor ? tinycolor(bgColor).darken(8).toString() : (!muted ? (dark ? "#1f2937" : "#d9d9d9") : dark ? "#d9d9d9" : "#1f2937")};
          color: ${textColor};
          border: ${muted ? `1px solid ${dark ? "#d1d5db" : "#4b5563"}` : "none"};
          box-shadow: ${flat ? "none" : shadows.md};
        }

        a:focus {
          box-shadow: ${shadows.xs}${flat ? "" : ", " + shadows.md};
          color: ${textColor};
        }

        a:active {
          background: ${backgroundColor ? tinycolor(bgColor).darken(10).toString() : (!muted ? (dark ? "#374151" : "#f3f4f6") : dark ? "#f3f4f6" : "#374151")};
          border: ${muted ? `1px solid ${dark ? "#e5e7eb" : "#374151"}` : "none"};
          box-shadow: ${shadows.xs}${flat ? "" : ", " + shadows.lg};
        }

        .icon {
          color: ${iconColorValue};
        }
      `}</style>
    </>
  );
};
