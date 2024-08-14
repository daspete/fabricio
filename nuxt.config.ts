import path from "path";

export default defineNuxtConfig({
  srcDir: "src/",
  compatibilityDate: "2024-08-10",
  routeRules: {
    "/game": { ssr: false },
  },
  modules: ["@nuxtjs/tailwindcss", "@primevue/nuxt-module"],
  primevue: {
    options: {
      unstyled: true,
      ripple: true,
    },
    importPT: {
      from: path.resolve(__dirname, "./src/ui/fabricio/"),
    },
  },
  tailwindcss: {
    config: {
      plugins: [require("tailwindcss-primeui")],
      content: ["./src/**/*.{js,vue,ts}"],
    },
  },
});
