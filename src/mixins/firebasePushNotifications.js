import { globalComputedData } from '../mixins/globalComputedData'

export const firebasePushNotifications = {

    mixins: [ globalComputedData ],

    methods: {
        initFirebasePushNotifications() {
            window.FirebasePlugin.hasPermission(data => {
                kw('FirebasePlugin hasPermission data: ', data)

                if (!data.isEnabled) {
                    window.FirebasePlugin.grantPermission(() => {
                        setTimeout(() => {
                            this.initialSubscriptions()
                        }, 2000)
                    }, () => {
                        ke('FirebasePlugin grantPermission error: ', error)
                    })
                } else {
                    this.initialSubscriptions()
                }
            }, error => {
                // error getting permissions
                ke('FirebasePlugin hasPermission error: ', error)
            })
        },

        initialSubscriptions() {
            window.FirebasePlugin.subscribe('allAppUsers')

            if (this.userLoginToken && this.authenticated) {
                window.FirebasePlugin.subscribe('signedInUsers')
            } else {
                window.FirebasePlugin.subscribe('unsignedInUsers')
            }
            this.setPushNotificationOpenHandler()
        },

        setPushNotificationOpenHandler() {
            window.FirebasePlugin.clearAllNotifications();

            window.FirebasePlugin.onNotificationOpen(notification => {
                kw('FirebasePlugin notification: ', notification)

                if (notification.tap) {
                    // the app was in background
                    if (notification.route) {
                        if (notification.route.includes('/externalURL')) {
                            let link = notification.route.split('?url=')[1]
                            k('notification external url: ', link)

                            this.openWindow(link, '_blank')
                        } else {
                            this.$router.push(notification.route)
                        }
                    }

                    var logEventObj = {
                        eventType: 'pushNotificationTapped',
                        eventDesc: 'push notification tapped by user',
                        notificationName: notification.notificationName,
                        notificationTitle: notification.title,
                        notificationBody: notification.body,
                        notificationRoute: notification.route
                    }
                    this.api.sendEvent(logEventObj)
                } else {
                    // the app was in foreground
                }

            }, error => {
                ke('FirebasePlugin onNotificationOpen error: ', error)
            })
        },

        subscribeToUserPushNotifications() {
            k('subscribeToUserPushNotifications: ', this.userInfo.userID)

            if (window.FirebasePlugin && this.userInfo.userID && !this.user.subscribedToUserPushNotifications) {
                window.FirebasePlugin.hasPermission(data => {
                    kw('FirebasePlugin hasPermission data: ', data)

                    if (data.isEnabled) {
                        window.FirebasePlugin.unsubscribe('unsignedInUsers')
                        window.FirebasePlugin.subscribe('signedInUsers')
                        window.FirebasePlugin.subscribe(`user_${this.userInfo.userID}`)
                        this.$store.commit('subscribedToUserPushNotifications', true)
                    }
                }, error => {
                    // error getting permissions
                    ke('FirebasePlugin hasPermission error: ', error)
                })
            }
        },

        unsubscribeToUserPushNotifications() {
            k('unsubscribeToUserPushNotifications: ', this.userInfo.userID)

            if (window.FirebasePlugin && this.user.subscribedToUserPushNotifications && this.userInfo.userID) {
                window.FirebasePlugin.unsubscribe('signedInUsers')
                window.FirebasePlugin.unsubscribe(`user_${this.userInfo.userID}`)
                window.FirebasePlugin.subscribe('unsignedInUsers')
                this.$store.commit('subscribedToUserPushNotifications', false)
            }
        }
    }
}
