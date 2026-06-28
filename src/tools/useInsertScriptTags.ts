import { onMounted } from "vue";
import { assert } from "keycloakify/tools/assert";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ScriptTag {
  type Common = { type: "text/javascript" | "module" };
  export type TextContent = Common & { textContent: string | (() => string) };
  export type Src = Common & { src: string };
}

export type ScriptTag = ScriptTag.TextContent | ScriptTag.Src;

const alreadyMountedComponentOrHookNames = new Set<string>();

export function useInsertScriptTags(params: {
  componentOrHookName: string;
  scriptTags: ScriptTag[];
}): {
  insertScriptTags: () => void;
} {
  const { scriptTags, componentOrHookName } = params;

  onMounted(() => {
    if (alreadyMountedComponentOrHookNames.has(componentOrHookName)) {
      if (
        new URL(window.location.href).searchParams.get("viewMode") !== "docs"
      ) {
        window.location.reload();
      }
      return;
    }
    alreadyMountedComponentOrHookNames.add(componentOrHookName);
  });

  let areScriptsInserted = false;

  const insertScriptTags = () => {
    if (areScriptsInserted) {
      return;
    }

    scriptTags.forEach((scriptTag) => {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if ("textContent" in scriptTag) {
          const textContent =
            typeof scriptTag.textContent === "function"
              ? scriptTag.textContent()
              : scriptTag.textContent;
          if (script.textContent === textContent) {
            return;
          }
          continue;
        }
        if ("src" in scriptTag) {
          if (script.getAttribute("src") === scriptTag.src) {
            return;
          }
          continue;
        }
        assert(false);
      }

      const htmlElement = document.createElement("script");
      htmlElement.type = scriptTag.type;
      if ("textContent" in scriptTag) {
        htmlElement.textContent =
          typeof scriptTag.textContent === "function"
            ? scriptTag.textContent()
            : scriptTag.textContent;
      } else if ("src" in scriptTag) {
        htmlElement.src = scriptTag.src;
      } else {
        assert(false);
      }
      document.head.appendChild(htmlElement);
    });

    areScriptsInserted = true;
  };

  return { insertScriptTags };
}
