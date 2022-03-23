import React from "react";
import getMeta from "~/_common/getMeta";
import ExternalLink from "@dvargas92495/ui/components/ExternalLink";

const ContactPage: React.FunctionComponent = () => (
  <>
    <h1>Contact Us</h1>
    <p>
      You can email us for any bugs, issues, or ideas at support@constancy.fund.
    </p>
    <p>
      Our DMs are also open on Twitter at{" "}
      <ExternalLink href={"https://twitter.com/constancyfund"}>
        @constancyfund
      </ExternalLink>.
    </p>
  </>
);

export const meta = getMeta({ title: "Contact Us" });

export default ContactPage;
