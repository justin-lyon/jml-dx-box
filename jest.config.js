const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");

module.exports = {
  ...jestConfig,
  setupFiles: ["<rootDir>/jest.setup.js"],
  modulePathIgnorePatterns: ["<rootDir>/.localdevserver"],
  moduleNameMapper: {
    "^lightning/platformShowToastEvent$":
      "<rootDir>/force-app/test/jest-mocks/lightning/platformShowToastEvent"
  }
};
