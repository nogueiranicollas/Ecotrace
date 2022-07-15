// eslint-disable-next-line @typescript-eslint/no-var-requires

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testMatch: ['**/*.spec.ts'],
  // testRegex: '(/__tests__/.*\\.(test|spec))\\.ts$',
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1'
  }
}
