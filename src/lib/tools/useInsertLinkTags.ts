import { onMounted, onUnmounted, ref, type Ref } from "vue";

const alreadyMountedComponentOrHookNames = new Set<string>();

/**
 * The component using this can only be mounted once and cannot rerender with
 * different hrefs. Mounting again reloads the page (mimics a server-rendered
 * page importing stylesheets in the head).
 */
export function useInsertLinkTags(params: { componentOrHookName: string; hrefs: string[] }): {
    areAllStyleSheetsLoaded: Ref<boolean>;
} {
    const { hrefs, componentOrHookName } = params;

    const areAllStyleSheetsLoaded = ref(false);

    onMounted(() => {
        if (alreadyMountedComponentOrHookNames.has(componentOrHookName)) {
            if (new URL(window.location.href).searchParams.get("viewMode") !== "docs") {
                window.location.reload();
            }
            return;
        }
        alreadyMountedComponentOrHookNames.add(componentOrHookName);
    });

    onMounted(() => {
        let isActive = true;

        (async () => {
            let lastMountedHtmlElement: HTMLLinkElement | undefined = undefined;
            const prs: Promise<void>[] = [];

            for (const href of hrefs) {
                const htmlElement = document.createElement("link");
                prs.push(new Promise<void>(resolve => htmlElement.addEventListener("load", () => resolve())));
                htmlElement.rel = "stylesheet";
                htmlElement.href = href;

                if (lastMountedHtmlElement !== undefined) {
                    lastMountedHtmlElement.insertAdjacentElement("afterend", htmlElement);
                } else {
                    document.head.prepend(htmlElement);
                }
                lastMountedHtmlElement = htmlElement;
            }

            await Promise.all(prs);
        })().then(() => {
            if (!isActive) {
                return;
            }
            areAllStyleSheetsLoaded.value = true;
        });

        onUnmounted(() => {
            isActive = false;
        });
    });

    return { areAllStyleSheetsLoaded };
}
