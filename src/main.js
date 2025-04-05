import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

app.use(vue3GoogleLogin, {
  clientId: `783993305941-hft8a0d5afmg9fshm7hic5ulsutccmdj.apps.googleusercontent.com`,
});

app.mount("#app");