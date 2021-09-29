import Vue from "vue";

export function mountVue<T>(
  container: HTMLElement,
  component: Vue.Component<any, any, any, T>,
  props: T,
  unmountCallback: (cb: () => void) => void
) {
  const root = container.ownerDocument.createElement("div");

  const vue: Promise<Vue> = new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        new Vue({
          shadowRoot: container.parentNode,
          el: root,
          render(h) {
            return h("m-c", { props });
          },
          components: { "m-c": component },
        })
      );
    }, 1);
  });

  unmountCallback(() => {
    vue.then((v) => v.$destroy());
  });

  return root;
}
