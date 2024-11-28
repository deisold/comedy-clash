import { pathsToModuleNameMapper } from 'ts-jest';
import { createRequire } from 'module';

// Use createRequire to handle JSON files without assertion
const require = createRequire(import.meta.url);
const { compilerOptions } = require('./tsconfig.json');

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/app/source/(.*)$': '<rootDir>/src/app/source/$1'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transpile TypeScript files
    '^.+\\.jsx?$': 'babel-jest' // Transpile JavaScript files
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};