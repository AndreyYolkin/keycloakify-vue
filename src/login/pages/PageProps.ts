import type { ClassKey } from '../TemplateProps';
import type { Component } from 'vue';

export type PageProps<NarrowedKcContext, I18n> = {
  // Template — это общий shell, который host прокидывает в страницу как есть (импортированный
  // Template.vue). Его тип — `__VLS_WithSlots<DefineComponent<...>>`, и он структурно НЕ
  // присваивается к `Component<TemplateProps<...>>`: расходятся и форма пропсов SFC, и параметр
  // I18n (у host-темы I18n может быть расширен своими message-ключами). В keycloakify-react это
  // не всплывает — там компонент это функция, а функции контравариантны по пропсам. В Vue же
  // строгий чекер (vize) такое присваивание роняет. Страница Template не типизирует (только
  // прокидывает во враппер), поэтому берём непараметризованный `Component`.
  Template: Component;
  kcContext: NarrowedKcContext;
  i18n: I18n;
  doUseDefaultCss: boolean;
  classes?: Partial<Record<ClassKey, string>>;
};
