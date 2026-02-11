module.exports = {
  testEnvironment: 'node',
  transform: {},
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/server.js',
    '!src/testRunner.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 83,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 10000,
};
