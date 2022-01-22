import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const i18n = new VueI18n({
   messages: {
      'en-US': require('./en-US'),
      'it-IT': require('./it-IT'),
      'ar-SA': require('./ar-SA'),
      'es-ES': require('./es-ES'),
      'fr-FR': require('./fr-FR'),
      'pt-BR': require('./pt-BR'),
      'de-DE': require('./de-DE'),
      'vi-VN': require('./vi-VN'),
      'ja-JP': require('./ja-JP'),
      'zh-CN': require('./zh-CN')
   }
});
export default i18n;
