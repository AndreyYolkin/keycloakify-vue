import { describe, expect, it } from "vitest";
import { isVNode } from "vue";
import { i18nBuilder } from "../src/lib/login/i18n/i18nBuilder";

describe("i18n bridge", () => {
    it("msg() returns a VNode, msgStr() returns a string", () => {
        const { useI18n } = i18nBuilder.build();
        // Valid KcContextLike shape: themeName + realm are required by createGetI18n
        const kcContext = {
            themeName: "keycloakify-vue-poc",
            realm: { internationalizationEnabled: false },
            locale: undefined,
            "x-keycloakify": { messages: {} }
        } as any;
        const { i18n } = useI18n({ kcContext });
        const value = i18n.value;
        expect(typeof value.msgStr("doLogIn")).toBe("string");
        expect(isVNode(value.msg("doLogIn"))).toBe(true);
    });
});
