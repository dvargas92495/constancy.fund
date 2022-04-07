import type { Cypress } from "local-cypress";
import dotenv from "dotenv";
dotenv.config();

export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => {
  config.supportFile = "cypress/support/index.ts";
  config.projectId = process.env.CYPRESS_PROJECT_ID;
  // config.baseUrl = process.env.HOST;
  config.env.HOST = process.env.HOST;
  config.env.CYPRESS_USER_PASSWORD = process.env.CYPRESS_USER_PASSWORD;
  return config;
};
