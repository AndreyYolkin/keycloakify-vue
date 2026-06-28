/* eslint-disable @typescript-eslint/no-namespace */
import type { Attribute, PasswordPolicies, Validators } from "keycloakify/login/KcContext";
import * as reactlessApi from "keycloakify/login/lib/getUserProfileApi";
import { assert, type Equals } from "tsafe/assert";
import { computed, onMounted, onUnmounted, ref, type ComputedRef, type VNode } from "vue";
import type { I18n } from "../i18n/i18n";
export { getButtonToDisplayForMultivaluedAttributeField } from "keycloakify/login/lib/getUserProfileApi";

export type FormFieldError = {
    errorMessage: VNode;
    errorMessageStr: string;
    source: FormFieldError.Source;
    fieldIndex: number | undefined;
};

{
    type A = Omit<FormFieldError, "errorMessage" | "errorMessageStr">;
    type B = Omit<reactlessApi.FormFieldError, "advancedMsgArgs">;
    assert<Equals<A, B>>();
}

export namespace FormFieldError {
    export type Source = Source.Validator | Source.PasswordPolicy | Source.Server | Source.Other;
    export namespace Source {
        export type Validator = { type: "validator"; name: keyof Validators };
        export type PasswordPolicy = { type: "passwordPolicy"; name: keyof PasswordPolicies };
        export type Server = { type: "server" };
        export type Other = { type: "other"; rule: "passwordConfirmMatchesPassword" | "requiredField" };
    }
}

{
    type A = FormFieldError.Source;
    type B = reactlessApi.FormFieldError.Source;
    assert<Equals<A, B>>();
}

export type FormFieldState = {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    valueOrValues: string | string[];
};

{
    type A = Omit<FormFieldState, "displayableErrors">;
    type B = Omit<reactlessApi.FormFieldState, "displayableErrors">;
    assert<Equals<A, B>>();
}

export type FormState = {
    isFormSubmittable: boolean;
    formFieldStates: FormFieldState[];
};

export type FormAction = reactlessApi.FormAction;

export type KcContextLike = reactlessApi.KcContextLike;

export type I18nLike = Pick<I18n, "advancedMsg" | "advancedMsgStr">;

export type ParamsOfUseUserProfileForm = {
    kcContext: KcContextLike;
    doMakeUserConfirmPassword: boolean;
    i18n: I18nLike;
};

{
    type A = Omit<ParamsOfUseUserProfileForm, "i18n">;
    type B = reactlessApi.ParamsOfGetUserProfileApi;
    assert<Equals<A, B>>();
}

export type ReturnTypeOfUseUserProfileForm = {
    formState: ComputedRef<FormState>;
    dispatchFormAction: (action: FormAction) => void;
};

export function useUserProfileForm(params: ParamsOfUseUserProfileForm): ReturnTypeOfUseUserProfileForm {
    const { doMakeUserConfirmPassword, i18n, kcContext } = params;

    const { advancedMsg, advancedMsgStr } = i18n;

    const api = reactlessApi.getUserProfileApi({ kcContext, doMakeUserConfirmPassword });

    const formState_reactless = ref(api.getFormState());

    let unsubscribe: (() => void) | undefined;

    onMounted(() => {
        unsubscribe = api.subscribeToFormState(() => {
            formState_reactless.value = api.getFormState();
        }).unsubscribe;
    });

    onUnmounted(() => unsubscribe?.());

    const formState = computed<FormState>(() => ({
        isFormSubmittable: formState_reactless.value.isFormSubmittable,
        formFieldStates: formState_reactless.value.formFieldStates.map(formFieldState_reactless => ({
            attribute: formFieldState_reactless.attribute,
            valueOrValues: formFieldState_reactless.valueOrValues,
            displayableErrors: formFieldState_reactless.displayableErrors.map(formFieldError_reactless => ({
                errorMessage: advancedMsg(...formFieldError_reactless.advancedMsgArgs),
                errorMessageStr: advancedMsgStr(...formFieldError_reactless.advancedMsgArgs),
                source: formFieldError_reactless.source,
                fieldIndex: formFieldError_reactless.fieldIndex
            }))
        }))
    }));

    return { formState, dispatchFormAction: api.dispatchFormAction };
}
