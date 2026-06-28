import {
  type LanguageTag as LanguageTag_defaultSet,
  type MessageKey as MessageKey_defaultSet,
} from 'keycloakify/account/i18n/messages_defaultSet/types';
import type { GenericI18n_noJsx } from 'keycloakify/account/i18n/noJsx/GenericI18n_noJsx';
import { createGetI18n, type KcContextLike } from 'keycloakify/account/i18n/noJsx/getI18n';
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import { Reflect } from 'tsafe/Reflect';
import { getCurrentInstance, h, onMounted, onUnmounted, ref, type Ref, type VNode } from 'vue';
import type { GenericI18n_vue } from './i18n';

export type ReturnTypeOfCreateUseI18n<
  MessageKey_themeDefined extends string,
  LanguageTag_notInDefaultSet extends string,
> = {
  useI18n: (params: { kcContext: KcContextLike }) => {
    i18n: Ref<
      GenericI18n_vue<
        MessageKey_defaultSet | MessageKey_themeDefined,
        LanguageTag_defaultSet | LanguageTag_notInDefaultSet
      >
    >;
  };
  ofTypeI18n: GenericI18n_vue<
    MessageKey_defaultSet | MessageKey_themeDefined,
    LanguageTag_defaultSet | LanguageTag_notInDefaultSet
  >;
};

export type { KcContextLike };

export function createUseI18n<
  ThemeName extends string = string,
  MessageKey_themeDefined extends string = never,
  LanguageTag_notInDefaultSet extends string = never,
>(params: {
  extraLanguageTranslations: {
    [languageTag in LanguageTag_notInDefaultSet]: {
      label: string;
      getMessages: () => Promise<{
        default: Record<MessageKey_defaultSet, string>;
      }>;
    };
  };
  messagesByLanguageTag_themeDefined: Partial<{
    [languageTag in LanguageTag_defaultSet | LanguageTag_notInDefaultSet]: {
      [key in MessageKey_themeDefined]: string | Record<ThemeName, string>;
    };
  }>;
}): ReturnTypeOfCreateUseI18n<MessageKey_themeDefined, LanguageTag_notInDefaultSet> {
  const { extraLanguageTranslations, messagesByLanguageTag_themeDefined } = params;

  type LanguageTag = LanguageTag_defaultSet | LanguageTag_notInDefaultSet;
  type MessageKey = MessageKey_defaultSet | MessageKey_themeDefined;
  type I18n = GenericI18n_vue<MessageKey, LanguageTag>;

  const cache = new WeakMap<GenericI18n_noJsx<MessageKey, LanguageTag>, I18n>();

  function renderHtmlString(htmlString: string, msgKey: string): VNode {
    const hasBlockLevelTag =
      htmlString.includes('<') &&
      htmlString.includes('>') &&
      ['div', 'section', 'article', 'ul', 'ol'].some((tagName) => htmlString.includes(`<${tagName}`));
    const elementName = hasBlockLevelTag ? 'div' : 'span';
    return h(elementName, {
      'data-kc-msg': msgKey,
      innerHTML: kcSanitize(htmlString),
    });
  }

  function withVue(i18n_noJsx: GenericI18n_noJsx<MessageKey, LanguageTag>): I18n {
    const cached = cache.get(i18n_noJsx);
    if (cached !== undefined) {
      return cached;
    }
    const i18n: I18n = {
      ...i18n_noJsx,
      msg: (msgKey, ...args) => renderHtmlString(i18n_noJsx.msgStr(msgKey, ...args), msgKey),
      advancedMsg: (msgKey, ...args) => renderHtmlString(i18n_noJsx.advancedMsgStr(msgKey, ...args), msgKey),
    };
    cache.set(i18n_noJsx, i18n);
    return i18n;
  }

  // Make block-level kc messages render inline (mirrors the Svelte port).
  if (typeof document !== 'undefined' && document.querySelector('style[data-kc-i18n]') === null) {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-kc-i18n', '');
    styleElement.textContent = `div[data-kc-msg] { display: inline-block; }`;
    document.head.prepend(styleElement);
  }

  const { getI18n } = createGetI18n({
    extraLanguageTranslations,
    messagesByLanguageTag_themeDefined,
  });

  function useI18n(params: { kcContext: KcContextLike }): { i18n: Ref<I18n> } {
    const { kcContext } = params;
    const { i18n, prI18n_currentLanguage } = getI18n({ kcContext });

    const i18nRef = ref(withVue(i18n)) as Ref<I18n>;

    if (getCurrentInstance() !== null) {
      onMounted(() => {
        let isActive = true;
        onUnmounted(() => {
          isActive = false;
        });
        prI18n_currentLanguage?.then((i18n_currentLanguage) => {
          if (!isActive) {
            return;
          }
          i18nRef.value = withVue(i18n_currentLanguage);
        });
      });
    } else {
      // Outside component context (e.g. tests): resolve the promise directly.
      prI18n_currentLanguage?.then((i18n_currentLanguage) => {
        i18nRef.value = withVue(i18n_currentLanguage);
      });
    }

    return { i18n: i18nRef };
  }

  return { useI18n, ofTypeI18n: Reflect<I18n>() };
}
