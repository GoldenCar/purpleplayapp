import store from '../store'
import j_ from '@jmellicker/j_'

const injection = {
    injectScriptIntoDOM(snippet) {
        k('injecting: ', snippet)

        var scriptRef = document.createElement('script');
            scriptRef.setAttribute('id', snippet.id)
            scriptRef.type = 'text/javascript';
        if (snippet.src) scriptRef.src = snippet.src;
        if (snippet.async) scriptRef.async = true;
        if (snippet.code) scriptRef.innerText = snippet.code;

        document[snippet.headOrBody].appendChild(scriptRef)
    },

    injectStyleIntoDOM(cssObj) {
        k('injecting css: ', cssObj)

        var styleRef = document.createElement('style');
            styleRef.setAttribute('id', cssObj.id)
            styleRef.type = 'text/css';
        if (cssObj.style) styleRef.innerText = cssObj.style;
        if (cssObj.src) styleRef.src = cssObj.src;

        document[cssObj.headOrBody].appendChild(styleRef)
    },

    injectCSSFileIntoDOM(cssObj) {
        k('injecting css: ', cssObj)

        var styleRef = document.createElement('link');
            styleRef.setAttribute('id', cssObj.id)
            styleRef.rel = 'stylesheet';
            styleRef.href = cssObj.url;

        document[cssObj.headOrBody].appendChild(styleRef)
    },

    injectImgIntoDOM(snippet) {
        k('injecting: ', snippet)

        var imgRef = document.createElement('img');
            imgRef.setAttribute('id', snippet.id)
        if (snippet.src) imgRef.src = snippet.src;
        if (snippet.style) imgRef.style = snippet.style;

        document[snippet.headOrBody].appendChild(imgRef)
    },

    checkForElementInDOMByID(id) {
        return document.getElementById(id)
    },

    injectCodeForCurrentView(view) {
        if (store.state.environment.json.codeSnippet[view]) {
            store.state.environment.json.codeSnippet[view].forEach((snippet) => {
                // check if script already exists
                if (!this.checkForElementInDOMByID(snippet.id)) {

                    if (snippet.type === 'script') {
                        // do we need to replace any {{}} vars?
                        if (snippet.code && snippet.code.includes('{{')) {
                            snippet.code = this.replaceInjectionCodeVars(snippet.code)
                            k('replacedCodeVars: ', snippet.code)
                        }

                        this.injectScriptIntoDOM(snippet)
                    }

                    if (snippet.type === 'style') {
                        this.injectStyleIntoDOM(snippet.id, snippet.code, snippet.headOrBody)
                    }

                    if (snippet.type === 'img') {
                        this.injectImgIntoDOM(snippet)
                    }

                    ki('checkForElementInDOMByID: ', this.checkForElementInDOMByID(snippet.id))
                } else {
                    k('script already exists in DOM, not injecting again')
                }
            })
        } else {
            k('no code snippet for view')
        }
    },

    replaceInjectionCodeVars(code) {
        // k('replaceInjectionCodeVars: ', code)

        var codeCopy = code
        // create varsObj
        var vars = []
        while (codeCopy.includes('{{')) {
            var start = code.indexOf('{{')
            var end = code.indexOf('}}')

            var var2add = code.substr(start, (end - start) + 2)
            k('substring: ', code, code.length, start, end, var2add)

            vars.push(var2add.replace(/{{|}}/g, ''))
            codeCopy = code.replace(var2add, '')
            k('code modified: ', codeCopy)
        }

        // k('vars: ', vars)

        // todo: add possible vars to replace here with references to their store value
        var varMap = {
            firstName: store.state.user.info.firstName,
            cartTotal: store.state.purchaseTotal,
            userEmail: store.state.user.userEmail
        }

        // assign value to vars
        var varsObj = {}
        vars.forEach((key) => {
            varsObj[key] = varMap[key]
        })

        // k('subVars: ', code, varsObj)

        return j_.subVars(code, varsObj)
    }
}

export default ({ Vue }) => {
  Vue.prototype.injection = injection
}
