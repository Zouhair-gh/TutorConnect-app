// tutorconnectfrontend/jest.config.js
module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)',
  ],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  }
};