import type { GenericI18n_noJsx } from 'keycloakify/account/i18n/noJsx/GenericI18n_noJsx';
import { type MessageKey as MessageKey_defaultSet } from 'keycloakify/account/i18n/messages_defaultSet/types';
import type { VNode } from 'vue';

/** INTERNAL: DO NOT IMPORT THIS */
export type GenericI18n_vue<MessageKey extends string, LanguageTag extends string> = GenericI18n_noJsx<
  MessageKey,
  LanguageTag
> & {
  /** Same as msgStr but returns a VNode with the html string rendered as html. */
  msg: (key: MessageKey_defaultSet, ...args: (string | undefined)[]) => VNode;
  /** Same as advancedMsgStr but returns a VNode with the html string rendered as html. */
  advancedMsg: (key: string, ...args: (string | undefined)[]) => VNode;
};

export type I18n = GenericI18n_vue<MessageKey_defaultSet, string>;
