import React from "react";
import DefaultLayout, {
  LayoutHead as DefaultLayoutHead,
} from "@dvargas92495/ui/dist/components/Layout";

const Layout: React.FC = ({ children }) => {
  return <DefaultLayout homeIcon={"Home"}>{children}</DefaultLayout>;
};

type HeadProps = Omit<Parameters<typeof DefaultLayoutHead>[0], "title">;

export const LayoutHead = ({
  title = "Welcome",
  ...rest
}: HeadProps & { title?: string }): React.ReactElement => {
  return (
    <DefaultLayoutHead title={`${title} | crowdinvestin`} {...rest} />
  );
};

export default Layout;