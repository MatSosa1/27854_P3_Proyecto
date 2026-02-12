module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/test/**/*.test.js'],
    verbose: true,
    testTimeout: 30000, // 30 segundos de timeout
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
    ],
};
