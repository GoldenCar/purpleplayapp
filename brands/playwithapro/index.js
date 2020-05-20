import brandData from './brandData';

export var views = [
    {
        path: '/signInUp',
        component: () => import('components/common/SignInUp')
    },

    {
        path: '/library',
        component: () => import('components/common/Library')
    },

    {
        path: '/play/:productID2Play',
        component: () => import('components/common/SuperPlayer'),
        props: true
    }
]

export var brand = Object.assign(brandData, {
    appID: 'com.platformpurple.playwithapro',
    brandColor: '#33306A',
    brandColorSecondary: '#33306A',
    logoFileName: 'playwithapro',
    environmentName: 'playwithapro',
    // freeBundleActivationCode: 'myWalkTVApp',
    // previewBundleActivationCode: 'myWalkTVAppPreview',
    brandURL: 'https://go.platformpurple.com/?e=playwithapro',
    signUpDescription: '',
    excludedProductTypes: ['exclusiveContent']
})
