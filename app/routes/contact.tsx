import React from "react";
import Layout, { getMeta } from "../_common/Layout";
import Contact from "@dvargas92495/ui/dist/components/Contact";

const ContactPage: React.FunctionComponent = () => (
  <Layout>
    <Contact email={"support@crowdinvestin.me"} />
  </Layout>
);

export const meta = getMeta({ title: "Contact Us" });

export default ContactPage;
