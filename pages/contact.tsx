import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import Contact from "@dvargas92495/ui/dist/components/Contact";

const ContactPage: React.FunctionComponent = () => (
  <Layout>
    <Contact email={"support@crowdinvestin.me"} />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"Contact Us"} />;
export default ContactPage;
