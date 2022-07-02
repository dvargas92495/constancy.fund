import type { Cypress } from "local-cypress";
import dotenv from "dotenv";
dotenv.config();

export default (
  _: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => {
  config.supportFile = "cypress/support/index.ts";
  config.projectId = process.env.CYPRESS_PROJECT_ID || '';
  // config.baseUrl = process.env.ORIGIN;
  config.env.ORIGIN = process.env.ORIGIN;
  config.env.CYPRESS_CREATOR_PASSWORD = process.env.CYPRESS_CREATOR_PASSWORD;
  config.env.CYPRESS_INVESTOR_PASSWORD = process.env.CYPRESS_INVESTOR_PASSWORD;
  return config;
};
