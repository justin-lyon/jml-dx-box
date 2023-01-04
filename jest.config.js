// crypto is a std web library available in all modern browsers
// it is also available in node v19+
// it is not however available at jest runtime
// jest uses jsdom which does not yet support the web crypto api
const crypto = require("crypto");

const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");

module.exports = {
  ...jestConfig,
  globals: {
    ...jestConfig.globals,
    crypto
  },
  modulePathIgnorePatterns: ["<rootDir>/.localdevserver"],
  moduleNameMapper: {
    "^lightning/platformShowToastEvent$":
      "<rootDir>/force-app/test/jest-mocks/lightning/platformShowToastEvent"
  }
};
