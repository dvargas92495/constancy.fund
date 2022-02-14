import React from "react";
import DefaultLayout from "@dvargas92495/ui/dist/components/Layout";
import { Head as DefaultHead } from "@dvargas92495/ui/dist/components/Document";
import type { MetaFunction } from "remix";

export const themeProps = {
  primary: "#316BFF",
  secondary: "#ff00ff",
  background: "#F8FBFF",
  warning: '#ff9090',
  subText: '#aeaeae',
  purple: '#347AE2',
  white: '#fff',
  lightgrey: '#f0f0f0',
  darkgrey: '#545454',
  grey: '#e0e0e0',
  black: '#000',
  overlay: {
      background: 'rgba(0, 0, 0, 0.1)',
      dialog: 'white',
  },
  lightblack: '#292C38',
  lineGrey: '#ECEFF4',
  lineLightGrey: '#E0E5ED',
  iconColor: '#96A0B5',
  darkerIconColor: '#7d8598',
  lightHover: '#F4F9FF',
  backgroundHighlight: '#e6f1ff',
  darkhover: '#E5F0FF',
  normalText: '#73778B',
  darkerText: '#292C38',
  lighterText: '#96A0B5',
  backgroundColor: '#F8FBFF',
  backgroundColorDarker: '#e5f0ff70',
  darkerBlue: '#5E6278',
  blue: '2563EB',
};

const Layout: React.FC = ({ children }) => {
  return (
    <DefaultLayout homeIcon={"Home"} themeProps={themeProps}>
      {children}
    </DefaultLayout>
  );
};

type HeadProps = Omit<Parameters<typeof DefaultHead>[0], "title">;

export const LayoutHead = ({
  title = "Welcome",
  ...rest
}: HeadProps & { title?: string }): React.ReactElement => {
  return <DefaultHead title={`${title} | CrowdInvestInMe`} {...rest} />;
};

export const getMeta =
  ({
    title: pageTitle,
    description = "",
    img = "",
  }: {
    title: string;
    description?: string;
    img?: string;
  }): MetaFunction =>
  () => {
    const title = `${pageTitle} | CrowdInvestInMe`;
    return {
      title,
      description,
      "og:title": title,
      "og:description": description,
      "og:type": "website",
      "twitter:card": "summary",
      "twitter:creator": "@dvargas92495",
      "twitter:title": title,
      "twitter:description": description,
      "og:image": img,
      "twitter:image": img,
    };
  };

export default Layout;
