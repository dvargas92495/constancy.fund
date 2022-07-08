import { cy, describe, it, Cypress } from "local-cypress";

const login = (email: string, password: string) => {
  cy.contains("LOGIN").click();
  cy.get("input[type=email]").type(email);
  cy.get("button.cl-sign-in-button").click();
  cy.get("div.cl-hidden input[type=password]").should("not.exist");
  cy.get("input[type=password]").type(Cypress.env(password));
  cy.get("button.cl-sign-in-button").click();
  cy.url().should("eq", `${Cypress.env("ORIGIN")}/user`);
};

const fillOutCreatorProfile = () => {
  cy.get('input[name="companyName"]').clear().type("Vargas Arts, LLC");
  const questionaires = [
    "ISAs for everybody.",
    "Pay for infrastructure. And just gennerally enjoy life.",
    "I made $50K on my own in the first year.",
    "2% off every contract. Let's gooo.",
  ];
  cy.get("textarea")
    .clear()
    .each((c, i) => cy.wrap(c).type(questionaires[i]));
  cy.get('input[name="demoVideo"]')
    .clear()
    .type("https://www.loom.com/share/833d682690a0450bbd799bffef1dd0d6");
  cy.get('input[name="attachDeck"]').clear().type("https://google.com");

  const socials = [
    "https://twitter.com/dvargas92495",
    "https://github.com/dvargas92495",
    "https://linkedin.com/in/dvargas92495",
    "https://davidvargas.me",
  ];
  cy.get('input[name="socialProfiles"]')
    .clear()
    .each((c, i) => cy.wrap(c).type(socials[i]));

  cy.get('input[name="paymentPreference.ethereum"]').check();
  cy.get('input[name="paymentPreference.ethereum.Address"]')
    .clear()
    .type("0x6d7C5b7B06e63679AdA34D06b2F98d567CEcf1Eb");

  cy.get('input[name="registeredCountry"]').clear().type("United States");
  cy.get('li > div[data-code="country-select-US"]').click();
  cy.get('input[name="companyRegistrationNumber"]').clear().type("8675309-69");
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

  cy.contains("Save Edits").click();
  cy.get("#success-profile-alert").should("be.visible");
};

const createIsaFundraise = () => {
  cy.contains("My Fundraise").click();
  cy.url().should("eq", `${Cypress.env("ORIGIN")}/user/fundraises/setup`);
  cy.contains("Income Sharing Agreement (ISA)")
    .parent()
    .parent()
    .contains("Select")
    .click();
  cy.url().should("eq", `${Cypress.env("ORIGIN")}/user/fundraises/setup/isa`);
  cy.contains("Monthly Stipend").click({ force: true });
  cy.contains("Amount you'd like to raise")
    .siblings()
    .first()
    .get("input")
    .type("4000");
  cy.contains("For how many months?")
    .siblings()
    .first()
    .get("input")
    .type("12");
  cy.contains("Total Funding Request").should("contain.text", "$48,000.000");
  cy.contains("Maximum return for investors")
    .siblings()
    .first()
    .get("input")
    .type("300");
  cy.contains("Maximum Return").should("contain.text", "$144,000.000");
  cy.contains("Income/Revenue Payback Threshold")
    .siblings()
    .first()
    .get("input")
    .type("18000");
  cy.contains("Share of revenue used for payback")
    .siblings()
    .first()
    .get("input")
    .type("20");
  cy.contains("Time Cap").siblings().first().get("input").type("5");
  cy.contains("Add Clause").click();
  cy.get("textarea").type("This is an additional clause");
  cy.contains("Create").click();
  cy.url().then((url) => {
    const urlParts = url.split("/");
    cy.wrap(urlParts.slice(-1)[0]).should("contain", `preview`);
    cy.wrap(urlParts.slice(0, -1).join("/")).as("link");
  });
  cy.get('input[type="checkbox"]').each((el) => cy.wrap(el).click());
  cy.contains("THIS INCOME SHARING AGREEMENT").should("exist");
  cy.contains("Confirm Terms").click();

  cy.url().then((url) =>
    cy.get("@link").then((expected) => cy.wrap(url).should("eq", expected))
  );
  cy.get("Copy Fundraise Link").click();
  cy.get("Public Link Copied!").should("exist");
  cy.get("Public Link Copied!", { timeout: 5000 }).should("not.exist");
  cy.window().its("navigator.clipboard").invoke("readText").as("publicLink");
};

const logOut = () => {
  cy.get('img[title="David Vargas"]').click();
  cy.contains("Sign out").click();
  cy.url().should("eq", Cypress.env("ORIGIN"));
};

const fillOutInvestorProfile = () => {
  cy.get('input[name="companyName"]').clear().type("Lotsa Capital, LLC");

  const questionaires = [
    "ISAs for everybody.",
    "Pay for infrastructure. And just generaly enjoy life.",
    "I made $50K on my own in the first year.",
    "2% off every contract. Let's gooo.",
  ];
  cy.get("textarea")
    .clear()
    .each((c, i) => cy.wrap(c).type(questionaires[i]));
  const socials = [
    "https://twitter.com/ConstancyFund",
    "https://github.com/dvargas92495/constancy.fund",
    "https://linkedin.com/in/constancyfund",
    "https://constancy.fund",
  ];
  cy.get('input[name="socialProfiles"]')
    .clear()
    .each((c, i) => cy.wrap(c).type(socials[i]));
  cy.get('input[name="paymentPreference.ethereum"]').check();
  cy.get('input[name="paymentPreference.ethereum.Address"]')
    .clear()
    .type("0x3C0C541D8FE924389Ee59FCB586f7F082268881d");
  cy.get('input[name="paymentPreference.paypal.EmailAddress"]')
    .clear()
    .type("test-investor@constancy.fund");

  cy.get('input[name="registeredCountry"]').clear().type("United States");
  cy.get('li > div[data-code="country-select-US"]').click();
  cy.get('input[name="companyRegistrationNumber"]').clear().type("1231233");
  cy.get('input[name="companyAddressStreet"]').clear().type("Main Ave");
  cy.get('input[name="companyAddressNumber"]').clear().type("456");
  cy.get('input[name="companyAddressCity"]').clear().type("Bikini Bottom");
  cy.get('input[name="companyAddressZip"]').clear().type("54321");

  cy.get('input[name="firstName"]').clear().type("Test");
  cy.get('input[name="lastName"]').clear().type("McTester");
  cy.get('input[name="contactEmail"]')
    .clear()
    .type("test-investor@constancy.fund");
  cy.get('input[name="representativeAddressStreet"]').clear().type("Main Ave");
  cy.get('input[name="representativeAddressNumber"]').clear().type("456");
  cy.get('input[name="representativeAddressCity"]')
    .clear()
    .type("Bikini Bottom");
  cy.get('input[name="representativeAddressZip"]').clear().type("54321");
};

const investInCreator = () => {
  cy.get("@publicLink").then((link) => cy.visit(link as unknown as string));
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
  cy.get('li > div[data-code="country-select-FR"]').click();
  cy.get('input[name="paymentPreference.paypal"]').check();
  cy.get('input[name="paymentPreference.paypal.EmailAddress"]')
    .clear()
    .type("test@constancy.fund");
  cy.get("#bottom-bar button[type=submit]").click();

  cy.get("#wait-contract-generated").should("be.visible");
  cy.get("#eversign-embed", { timeout: 20000 }).should("be.visible");
};

describe("Testing core workflows", () => {
  before(() => {
    cy.exec("ts-node cypress/scripts/setup.ts");
  });
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
    login("test-creator@constancy.fund", "CYPRESS_CREATOR_PASSWORD");
    fillOutCreatorProfile();
    createIsaFundraise();
    logOut();
    login("test-investor@constancy.fund", "CYPRESS_INVESTOR_PASSWORD");
    fillOutInvestorProfile();
    investInCreator();
  });
});
