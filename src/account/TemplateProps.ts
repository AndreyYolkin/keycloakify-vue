import type { ClassKey } from 'keycloakify/account/lib/kcClsx';

export type TemplateProps<KcContext, I18n> = {
  kcContext: KcContext;
  i18n: I18n;
  doUseDefaultCss: boolean;
  active: string;
  classes?: Partial<Record<ClassKey, string>>;
};

export type { ClassKey };
