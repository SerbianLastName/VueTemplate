import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";

const app = createApp(App).use(router);

app.use(WaveUI, {});

app.mount("#app");
