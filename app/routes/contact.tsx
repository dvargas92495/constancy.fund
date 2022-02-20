import React from "react";
import getMeta from "~/_common/getMeta";
import Contact from "@dvargas92495/ui/dist/components/Contact";

const ContactPage: React.FunctionComponent = () => (
  <Contact email={"support@constancy.fund"} />
);

export const meta = getMeta({ title: "Contact Us" });

export default ContactPage;
