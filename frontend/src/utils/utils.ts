import _ from 'lodash';
import { BaseErrorMessage } from '../common/BaseErrorMessage';
export function isNotNullOrEmpty(str: string | null | undefined): boolean {
  return !_.isNil(str) && !_.isEmpty(str.trim());
}

export const hasNoErrors = <T extends BaseErrorMessage>(errors: T): boolean =>
  Object.values(errors).every(value => value === '');
