// we import the external package
import VueI18n from 'vue-i18n'
// let's say we have a file in /src/i18n containing the language pack
// import messages from 'src/i18n'

const brand = require(process.env.BRAND_INDEX_FILE).brand

export default ({
    app,
    Vue,
    store
}) => {
    // we tell Vue to use our Vue package:
    Vue.use(VueI18n)

    let commonMessages = {
        en: {
            'random_message_test': 'wwoooowwwwzaaa!'
        },
        ar: {
            'random_message_test': 'wowzaa in arabic'
        }
    }

    let selectedLocale = localStorage.getItem('locale') ? localStorage.getItem(
        'locale') : brand.defaultLocale || 'en';

    let brandMessages = Vue.prototype.brand.messages

    let messages = {}

    brandMessages && Object.keys(brandMessages).forEach(lang => {
        messages[lang] = Object.assign(brandMessages[lang] || {},
            commonMessages[lang] || {})
    })

    // Set i18n instance on app;
    // We inject it into root component by doing so;
    // new Vue({..., i18n: ... }).$mount(...)
    app.i18n = new VueI18n({
        locale: selectedLocale,
        fallbackLocale: 'en',
        messages
    })

    Object.defineProperty(Vue.prototype, '$locale', {
        get: function () {
            return app.i18n.locale
        },
        set: function (locale) {
            app.i18n.locale = locale
            localStorage.setItem('locale', locale)

            let oldLanguage = locale === 'ar' ? 'eng' : 'ara';
            let newLanguage = locale === 'ar' ? 'ara' : 'eng';

            this.api.sendEvent({
                eventType: "languageChanged",
                oldLanguage: oldLanguage,
                newLanguage: newLanguage,
                eventDesc: `user changed language from ${oldLanguage} to from ${newLanguage}`
            })
            
        }
    })

}
