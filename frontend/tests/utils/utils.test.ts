import { isNotNullOrEmpty } from '../../src/utils/utils'

describe('isNotNullOrEmpty', () => {
    test('should return false for null', () => {
        expect(isNotNullOrEmpty(null)).toBe(false);
    });

    test('should return false for undefined', () => {
        expect(isNotNullOrEmpty(undefined)).toBe(false);
    });

    test('should return false for an empty string', () => {
        expect(isNotNullOrEmpty('')).toBe(false);
    });

    test('should return false for a string with only spaces', () => {
        expect(isNotNullOrEmpty('   ')).toBe(false);
    });

    test('should return true for a non-empty string', () => {
        expect(isNotNullOrEmpty('hello')).toBe(true);
    });

    test('should return true for a string with spaces and characters', () => {
        expect(isNotNullOrEmpty('  hello  ')).toBe(true);
    });
});