import { type ClassKey, type TemplateProps } from "../TemplateProps";
import type { Component, Ref } from "vue";

export type PageProps<NarrowedKcContext, I18n> = {
    Template: Component<TemplateProps<NarrowedKcContext, I18n>>;
    kcContext: NarrowedKcContext;
    i18n: Ref<I18n>;
    doUseDefaultCss: boolean;
    classes?: Partial<Record<ClassKey, string>>;
};
