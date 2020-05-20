const http = require("axios");
const j_ = require("@jmellicker/j_");
import store from "../store";
import { Platform } from 'quasar';
const brand = require(process.env.BRAND_INDEX_FILE).brand;

const forceProductionAPI = false;

async function getNetworkType() {
    if (!navigator.onLine) {
        return 'none';
    }
    if (Platform.is.electron) {
        network = require('network');
        return await new Promise((resolve) => {
            network.get_active_interface(function(err, obj) {
                switch (obj.type){
                    case 'Wireless':
                        resolve('wifi');
                        break;
                    case 'Wired':
                        resolve('ethernet');
                        break;
                    default:
                        resolve('unknown');
                }
            })
        })
    }
    return navigator.connection.type;
}

let network, networkType;


const whichServer = function() {
    // returns -dev, -staging or '' todo: modify for DS9

    // var returnValue

    // var URLprefix = j_.firstItemOf(window.location.host, '.')

    // var serverType = forceProductionAPI ? '' : URLprefix.split('-').pop()

    // // kw('which server? ' + serverType)

    // switch (serverType) {
    //     case 'dev':
    //     case 'dev4':
    //         returnValue = '-dev2'
    //         break;
    //     case 'staging':
    //         returnValue = '-staging'
    //         break;
    //     default:
    //         returnValue = ''

    //         // TODO VERY IMPORTANT:  remove before pushing to production
    //         // returnValue = '-staging'

    // }

    var returnValue = "";
    if (devMode()) returnValue = "-dev2";

    return returnValue;
};

// const endpointDomain4Server = function(reqRoute)

const api = {
    whichServer: whichServer,

    ioRoute: whichServer()
        ? "https://io-dev.platformpurple.com/"
        : "https://io.platformpurple.com/",
    apiv3Route: whichServer()
        ? "https://api-v3" + whichServer() + ".platformpurple.com/"
        : "https://api-v3.platformpurple.com/",
    apiv4Route: whichServer()
        ? "https://api-v4" + whichServer() + ".platformpurple.com/"
        : "https://api-v4.platformpurple.com/",
    bigRoute: whichServer()
        ? "https://big-dev.platformpurple.com/"
        : "https://big.platformpurple.com/",

    get(route, cb) {
        this.send2API("get", route, {}, cb);
    },

    post(route, req, cb) {
        this.send2API("post", route, req, cb);
    },

    put(route, req, cb) {
        this.send2API("put", route, req, cb);
    },

    delete(route, cb) {
        this.send2API("delete", route, {}, cb);
    },

    send2API(method, route, req, cb) {
        // k('main.js send2API req:', method, route, req, cb)
        http[method](route, req)
            .then(res => {
                // k('send2API res:', res.data)
                cb(res.data);
            })
            .catch(error => {
                throw error;
            });
    },

    async sendEvent(event) {
        event.sessionGroup = store.state.sessionGroup;
        event.origin = "purplePlay";
        event.environment = brand.environmentName;
        event.clientTimestamp = Date.now();

        event.connectionType = await getNetworkType();
        if (localStorage.getItem("locale")) event.language = localStorage.getItem("locale") === 'en' ? 'eng' : 'ara';

        var currentSessionInfo = j_.cloneObject(store.state.sessionLogObj);
        k("currentSessionInfo: ", currentSessionInfo);

        var mergedEvent = j_.mergeObjects(event, currentSessionInfo);

        var route = this.ioRoute + "logEvent";
        k("sending event", route, mergedEvent);

        var offlineEvents = localStorage.getItem("eventsNotSent");
        if (offlineEvents) {
            offlineEvents = JSON.parse(offlineEvents);
        }
        if (!offlineEvents) offlineEvents = [];
        k("offline events: ", offlineEvents);

        if (store.state.appOffline) {
            offlineEvents.push(mergedEvent);
            localStorage.setItem("eventsNotSent", JSON.stringify(offlineEvents));

            k("added new offline events: ", offlineEvents);
        } else {
            if (offlineEvents.length) {
                offlineEvents.forEach(offlineEvent => {
                    k("sending offline event: ", offlineEvent);
                    this.post(route, offlineEvent, res => {
                        k("sending offline res: ", res);
                    });
                });
                localStorage.setItem("eventsNotSent", "");
            }

            this.post(route, mergedEvent, res => {
                k("sendEvent res: ", res);
            });
        }
    },

    // apiv3
    // signURL(sku, url, userLoginToken, cb) {
    //     var req = {
    //         userLoginToken: userLoginToken,
    //         productSKU: sku,
    //         url: url
    //     }

    //     console.log('signURL req: ', req)

    //     this.post(this.apiv3Route + 'product/signedURL', req, (res) => {
    //         console.log('signURL res: ', res)
    //         if (!res) {
    //             // logEvent({
    //             //     eventType: 'requestError',
    //             //     eventDesc: 'error requesting signed URL from API',
    //             // })
    //         }
    //         cb(res)
    //     })
    // },

    signURL(productSKU, fileName, userLoginToken, mediaType, cb) {
        var req = {
            mediaType: mediaType,
            productSKU: productSKU,
            fileName: fileName,
            userLoginToken: userLoginToken
        };

        k("signURL req: ", req);

        this.post(this.apiv4Route + "api/product/signedURL", req, res => {
            k("signURL res: ", res);
            if (!res || !res.success) {
                // logEvent({
                //     eventType: 'requestError',
                //     eventDesc: 'error requesting signed URL from API',
                // })
            }
            cb(res);
        });
    }
};

export default api;
