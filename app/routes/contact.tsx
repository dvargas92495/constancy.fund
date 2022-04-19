import React from "react";
import getMeta from "~/_common/getMeta";

const ContactPage: React.FunctionComponent = () => (
  <>
    <h1>Contact Us</h1>
    <p>
      You can email us for any bugs, issues, or ideas at support@constancy.fund.
    </p>
    <p>
      Our DMs are also open on Twitter at{" "}
      <a href={"https://twitter.com/constancyfund"} target={"_blank"} rel={"noopener"}>
        @constancyfund
      </a>.
    </p>
  </>
);

export const meta = getMeta({ title: "Contact Us" });

export default ContactPage;
