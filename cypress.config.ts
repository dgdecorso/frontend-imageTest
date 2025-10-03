import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://diego.dev.noseryoung.ch",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
