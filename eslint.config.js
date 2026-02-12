module.exports = [
    {
        ignores: [
            'node_modules/**',
            'carga-rendimiento.js',
            'jest.config.js',
            'JMeter/**',
            'coverage/**',
            '**/*.min.js',
            '**/bower_components/**',
            '**/dist/**',
        ],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'comma-dangle': 'off',
        },
    },
];