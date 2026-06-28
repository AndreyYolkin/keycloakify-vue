import type { Attribute } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { FormAction, FormFieldError } from '../lib/useUserProfileForm';
import type { I18n } from '../i18n/i18n';

export type InputFieldByTypeProps = {
  attribute: Attribute;
  valueOrValues: string | string[];
  displayableErrors: FormFieldError[];
  dispatchFormAction: (action: FormAction) => void;
  i18n: I18n;
  kcClsx: KcClsx;
};
