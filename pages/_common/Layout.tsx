import React from "react";
import DefaultLayout from "@dvargas92495/ui/dist/components/Layout";
import { Head as DefaultHead } from "@dvargas92495/ui/dist/components/Document";

const Layout: React.FC = ({ children }) => {
  return (
    <DefaultLayout
      homeIcon={"Home"}
      themeProps={{
        primary: "#316BFF",
        secondary: "#ff00ff",
        background: "#F7F8FC",
      }}
    >
      {children}
    </DefaultLayout>
  );
};

type HeadProps = Omit<Parameters<typeof DefaultHead>[0], "title">;

export const LayoutHead = ({
  title = "Welcome",
  ...rest
}: HeadProps & { title?: string }): React.ReactElement => {
  return <DefaultHead title={`${title} | crowdinvestin`} {...rest} />;
};

export default Layout;
