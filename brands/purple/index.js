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
    appID: 'com.platformpurple.purplePlay',
    brandColor: '#565088',
    brandColorSecondary: '#565088',
    logoFileName: 'purple',
    environmentName: 'purple',
    // freeBundleActivationCode: 'myWalkTVApp',
    // previewBundleActivationCode: 'myWalkTVAppPreview',
    brandURL: 'https://go.platformpurple.com/',
    signUpDescription: '',
    excludedProductTypes: ['exclusiveContent']
})
