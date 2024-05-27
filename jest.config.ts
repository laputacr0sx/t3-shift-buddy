import nextJest from 'next/jest';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './'
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom',
    transformIgnorePatterns: [
        'node_modules/(?!@azure/msal-react)',
        'node_modules/(?!(antd)/)'
    ],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest'
    }
};
const asyncConfig = createJestConfig(customJestConfig);

// and wrap it...
module.exports = async () => {
    const config = await asyncConfig();
    config.transformIgnorePatterns = [
        // ...your ignore patterns
    ];
    return config;
};
