import _ from 'lodash';
import { BaseErrorMessage } from '../common/BaseErrorMessage';
export function isNotNullOrEmpty(str: string | null | undefined): boolean {
  return !_.isNil(str) && !_.isEmpty(str.trim());
}

export const hasNoErrors = <T extends BaseErrorMessage>(errors: T): boolean =>
  Object.values(errors).every(value => value === '');

export function generateRandomHash(): string {
  const length = 64; // 32 bytes in hexadecimal
  const characters = 'abcdef0123456789';
  let result = '0x';
  for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}
