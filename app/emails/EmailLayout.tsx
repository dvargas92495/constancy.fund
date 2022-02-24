import React from "react";

const EmailLayout: React.FC = ({ children }) => (
  <div
    style={{
      margin: "0 auto",
      maxWidth: 600,
      fontFamily: `"Proxima Nova","proxima-nova",Helvetica,Arial sans-serif`,
      padding: `20px 0`,
    }}
  >
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        paddingBottom: 20,
        borderBottom: "1px dashed #dadada",
        textAlign: "center",
      }}
    >
      <img height={40} src={`${process.env.HOST}/images/constancy-logo.svg`}></img>
    </div>
    <div
      style={{
        width: "80%",
        margin: "30px auto",
        fontSize: 16,
      }}
    >
      {children}
    </div>
    <div
      style={{
        width: "80%",
        margin: "30px auto",
        borderTop: "1px dashed #dadada",
        display: "flex",
        color: "#a8a8a8",
        paddingTop: 15,
      }}
    >
      <div style={{ width: "50%" }}>
        Sent From{" "}
        <a
          href={process.env.HOST}
          style={{ color: "#4d9bd7", textDecoration: "none" }}
        >
          Constancy
        </a>
      </div>
      <div style={{ width: "50%", textAlign: "right" }}>
        <a
          href={`mailto:support@${process.env.HOST}`}
          style={{ color: "#4d9bd7", textDecoration: "none" }}
        >
          Contact Support
        </a>
      </div>
    </div>
  </div>
);

export default EmailLayout;
