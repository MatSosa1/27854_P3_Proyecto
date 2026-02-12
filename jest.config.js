module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
      }
    }],
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    'Pruebas-Unitarias-Backend/src/**/*.{js,ts}',
    'Pruebas-Unitarias-Frontend/src/**/*.{js,ts}',
    '!**/*.test.{js,ts}',
    '!**/*.spec.{js,ts}',
    '!src/server.js',
    '!src/testRunner.js',
    '!Pruebas-Unitarias-Backend/src/testRunner.js',
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
