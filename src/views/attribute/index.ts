import { mountVue } from "../../mountVue";
import Combitus from "./Combitus.vue";

aha.on("combitus", (({ container, record, onUnmounted }, { settings }) =>
  mountVue(
    container,
    Combitus,
    { record },
    onUnmounted
  )) as Aha.RenderExtension);
