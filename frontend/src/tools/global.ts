import { reactive } from "vue";

export const global = reactive({
  user: {
    username: "",
    loggedIn: false,
    email: "",
  },
  state: {
    login: false,
    register: false,
    edit: false,
  },
  popup: {
    open: false,
    error: false,
    title: "",
    message: "",
    timeout: 1500,
  },

  setName() {
    this.user.username =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("Username"))
        ?.split("=")[1] || "";
    if (this.user.username == "") {
      this.user.loggedIn = false;
      return;
    }
    this.user.loggedIn = true;
  },

  setPopup(error: boolean, title: string, message: string, timeout: number) {
    this.popup.open = true;
    this.popup.error = error;
    this.popup.title = title;
    this.popup.message = message;
    setTimeout(() => {
      this.popup.open = false;
      this.popup.error = false;
      this.popup.title = "";
      this.popup.message = "";
    }, timeout);
  },
});
