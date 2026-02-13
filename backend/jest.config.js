module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
  testTimeout: 30000,
  testRunner: "jest-circus/runner",
  verbose: true
};