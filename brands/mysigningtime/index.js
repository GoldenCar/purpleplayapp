import brandData from './brandData';

export var views = [
    {
        path: '/signInUp',
        component: () => import('components/common/SignInUp')
    },

    {
        path: '/library',
        component: () => import('components/custom/mysigningtime/LibraryByMediaType')
    },

    {
        path: '/play/:productID2Play',
        component: () => import('components/common/SuperPlayer'),
        props: true
    }
]

export var brand = Object.assign(brandData, {
    appID: 'com.platformpurple.purplePlay',

    brandColor: '#2d82bd',
    brandColorSecondary: '#2d82bd',
    logoFileName: 'mysigningtime',
    environmentName: 'mysigningtime',
    validSubscriptionProductIDs: [109776, 109777, 148783],

    previewBundleActivationCode: 'TLHpreview',
    freeBundleActivationCode: 'TLHfreeApp',
    previewBundleID: 155435,
    freeBundleID: 149684,
    freeProductsRowCardClass: 'col-xs-6 col-sm-3 col-md-2',

    brandURL: 'https://mysigningtime.com/',
    signUpDescription: '',
    excludedProductTypes: ['exclusiveContent'],

    customVideoLayout: () => import('components/custom/mysigningtime/MySigningTimeVideoLayout'),
    customAudioLayout: () => import('components/custom/mysigningtime/MySigningTimeAudioLayout'),
})
