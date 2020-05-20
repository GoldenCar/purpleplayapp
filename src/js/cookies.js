import Quasar, { Cookies } from 'quasar'

const cookies = {
    setCookie(key, value) {
        var domain = window.location.hostname
        if (domain.indexOf('platformpurple.com') > -1) domain = '.platformpurple.com'
        Cookies.set(key, value, { expires: 365, domain: domain, path: '/' })
    },
    
    resetCookie(key) {
        var domain = window.location.hostname
        if (domain.indexOf('platformpurple.com') > -1) domain = '.platformpurple.com'
        Cookies.set(key, '', { expires: -1, domain: domain, path: '/' })
    }
}

export default cookies
