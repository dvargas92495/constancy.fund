import React from "react";
import DefaultLayout from "@dvargas92495/ui/dist/components/Layout";
import { Head as DefaultHead } from "@dvargas92495/ui/dist/components/Document";
import type { MetaFunction } from "remix";

export const themeProps = {
  primary: "#316BFF",
  secondary: "#ff00ff",
  background: "#F7F8FC",
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
      viewport: "initial-scale=1.0, width=device-width",
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
