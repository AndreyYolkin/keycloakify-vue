import type { Attribute } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { FormAction, FormFieldError } from '../lib/useUserProfileForm';
import type { I18n } from '../i18n/i18n';

export type UserProfileFormFieldsProps<KcContext = any, I18nType = I18n> = {
  kcContext: Extract<KcContext, { profile: unknown }>;
  i18n: I18nType;
  kcClsx: KcClsx;
  onIsFormSubmittableValueChange: (isFormSubmittable: boolean) => void;
  doMakeUserConfirmPassword: boolean;
};

/** Scoped-slot payload for the optional `beforeField` / `afterField` slots. */
export type BeforeAfterFieldSlotProps = {
  attribute: Attribute;
  dispatchFormAction: (action: FormAction) => void;
  displayableErrors: FormFieldError[];
  valueOrValues: string | string[];
  kcClsx: KcClsx;
  i18n: I18n;
};
