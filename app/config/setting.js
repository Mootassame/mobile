/**
 * Basic Setting Variables Define
 */
export const BaseSetting = {
  name: "FelixPro",
  displayName: "FelixPro",
  appVersion: "1.1.1",
  defaultLanguage: "fr",
  languageSupport: ["en", "ar", "fr"],
  resourcesLanguage: {
    en: {
      translation: require("../lang/en.json"),
    },

    ar: {
      translation: require("../lang/ar.json"),
    },

    fr: {
      translation: require("../lang/fr.json"),
    },
  },
};
