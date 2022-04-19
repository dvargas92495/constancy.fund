import { cy, describe, it, Cypress } from "local-cypress";

describe("Testing core workflows", () => {
  it("Creates a contract between a user and an investor", () => {
    cy.visit(Cypress.env("ORIGIN"), { failOnStatusCode: false });
    cy.get("div#user-container > div").then((val) => {
      if (!val.children().first().is("a")) {
        cy.get(
          "button.cl-user-button-trigger > img.cl-user-button-avatar"
        ).click();
        cy.get("button.cl-accounts-manager-button")
          .then((bs) => cy.wrap(bs.last()))
          .click();
      }
    });
    cy.get("a[href='/login']").click();
    cy.get("input[type=email]").type("test-creator@constancy.fund");
    cy.get("button.cl-sign-in-button").click();
    cy.get("div.cl-hidden input[type=password]").should("not.exist");
    cy.get("input[type=password]").type(Cypress.env("CYPRESS_USER_PASSWORD"));
    cy.get("button.cl-sign-in-button").click();
    cy.url().should("eq", `${Cypress.env("ORIGIN")}/user`);

    cy.get('input[name="companyName"]').clear().type("Vargas Arts, LLC");
    const questionaires = [
      "ISAs for everybody.",
      "Pay for infrastructure. And just gennerally enjoy life.",
      "I made $50K on my own in the first year.",
      "2% off every contract. Let's gooo.",
    ];
    cy.get('textarea[name="questionaires"]')
      .clear()
      .each((c, i) => cy.wrap(c).type(questionaires[i]));
    const socials = [
      "https://twitter.com/dvargas92495",
      "https://github.com/dvargas92495",
      "https://linkedin.com/in/dvargas92495",
      "https://davidvargas.me",
    ];
    cy.get('input[name="socialProfiles"]')
      .clear()
      .each((c, i) => cy.wrap(c).type(socials[i]));
    cy.get('input[name="demoVideo"]').clear().type(
      "https://www.loom.com/share/833d682690a0450bbd799bffef1dd0d6"
    );
    cy.get('input[name="attachDeck"]').clear().type(
      "https://google.com"
    );
    cy.get('input[name="paymentPreference.ethereum"]').check();
    cy.get('input[name="paymentPreference.ethereum.Address"]')
      .clear()
      .type("0x6d7C5b7B06e63679AdA34D06b2F98d567CEcf1Eb");

    cy.get('input[name="registeredCountry"]').clear().type("United States");
    cy.get('li > div[data-code="country-select-US"]').click();
    cy.get('input[name="companyRegistrationNumber"]')
      .clear()
      .type("8675309-69");
    cy.get('input[name="companyAddressStreet"]').clear().type("Main St");
    cy.get('input[name="companyAddressNumber"]').clear().type("123");
    cy.get('input[name="companyAddressCity"]').clear().type("Gotham");
    cy.get('input[name="companyAddressZip"]').clear().type("12345");

    cy.get('input[name="firstName"]').clear().type("David");
    cy.get('input[name="lastName"]').clear().type("Vargas");
    cy.get('input[name="contactEmail"]')
      .clear()
      .type("test-creator@constancy.fund");
    cy.get('input[name="representativeAddressStreet"]').clear().type("Main St");
    cy.get('input[name="representativeAddressNumber"]').clear().type("123");
    cy.get('input[name="representativeAddressCity"]').clear().type("Gotham");
    cy.get('input[name="representativeAddressZip"]').clear().type("12345");

    cy.get("button[type=submit]").click();
    cy.get("#success-profile-alert").should("be.visible");

    cy.visit(`${Cypress.env("ORIGIN")}/creator/user_21vC5l7JKfQfY79q1OhYsFiviM1`);
    cy.get("#top-bar-profile #back-this-project").click();
    cy.get('input[name="amount"]').clear().type("10000");
    cy.get('input[name="term"]').each((c) => cy.wrap(c).check());

    cy.get('input[name="name"]').clear().type("Test McTester");
    cy.get('input[name="email"]').clear().type("test@constancy.fund");
    cy.get('input[name="investorAddressStreet"]').clear().type("Main Ave");
    cy.get('input[name="investorAddressNumber"]').clear().type("456");
    cy.get('input[name="investorAddressCity"]').clear().type("Earth");
    cy.get('input[name="investorAddressZip"]').clear().type("67890");
    cy.get('input[name="investorAddressCountry"]').clear().type("France");
    cy.get('li[data-code="country-select-FR"]').click();
    cy.get('input[name="paymentPreference.paypal"]').check();
    cy.get('input[name="paymentPreference.paypal.EmailAddress"]')
      .clear()
      .type("test@constancy.fund");
    cy.get("#bottom-bar button[type=submit]").click();

    cy.get("#wait-contract-generated").should("be.visible");
    cy.get("#eversign-embed", { timeout: 20000 }).should("be.visible");
  });
});
