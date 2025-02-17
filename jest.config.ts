import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest/presets/default-esm',
  testPathIgnorePatterns: ['./dist'],
  transform: {
    '^.+\\.(ts)?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  verbose: true,
};

export default config;
