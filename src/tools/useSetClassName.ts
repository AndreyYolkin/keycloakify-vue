import { onMounted, onUnmounted } from "vue";

export function useSetClassName(params: { qualifiedName: "html" | "body"; className: string | undefined }): void {
    const { qualifiedName, className } = params;

    onMounted(() => {
        if (!className || className === "") {
            return;
        }
        const classList = document.getElementsByTagName(qualifiedName)[0].classList;
        const tokens = className.split(" ");
        classList.add(...tokens);
        onUnmounted(() => classList.remove(...tokens));
    });
}
