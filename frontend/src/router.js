import { createRouter, createWebHistory } from "vue-router";
import HomeVue from "./pages/Home.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: HomeVue,
    },
  ],
});
