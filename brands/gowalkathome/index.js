import brandData from './brandData';

export var views = [
    {
        path: '/signInUp',
        component: () => import('components/common/SignInUp')
    },

    {
        path: '/library',
        component: () => import('components/custom/gowalkathome/Library')
    },

    {
        path: '/play/:productID2Play',
        component: () => import('components/common/SuperPlayer'),
        props: true
    },

    {
        path: '/yourdailywalk',
        component: () => import('components/custom/gowalkathome/YourDailyWalk')
    }

]

export var brand = Object.assign(brandData, {
    brandColor: '#F8BE3C',
    brandColorSecondary: '#ff3a3a',
    topNavColor: '#fff',
    topNavIconColor: 'black',
    logoFileName: 'gowalkathome',
    environmentName: 'gowalkathome',
    freeBundleActivationCode: 'myWalkTVApp',
    previewBundleActivationCode: 'myWalkTVAppPreview',
    brandURL: 'https://go.walkathome.com/',
    signUpDescription: '<p>Subscribers to the Walk At Home e-newsletter enjoy free access to a rotating selection of videos from our Walk At Home library and Your Daily Walk workouts. Our e-newsletter offers fitness advice, inspiring stories, special offers, and news about Walk At Home. We hope you have as much fun reading it as we have writing it!</p>',
    validSubscriptionProductIDs: [109776, 109777, 148783, 149295, 149296],
    myWalkTVSubscriptionsProductIDs: [149295, 149296],
    ydwSubscriptionsProductIDs: [109776, 109777, 148783, 149595],
    previewBundleID: 150413,
    freeBundleID: 149196,
    hideAdvancedControls: true,

    clientFreeProductCard:  () => import('components/custom/gowalkathome/FreeProductCard'),
    // clientTagSidebar:  () => import('components/custom/gowalkathome/pvolveTagSidebar'),
    // clientProductCard:  () => import('components/custom/gowalkathome/walkAtHomeCard'),
    // customVideoLayout: () => import('components/custom/gowalkathome/pvolveVideoLayout'),
    clientMenu: () => import('components/custom/gowalkathome/RightMenu'),
    // customTopNav: () => import('components/custom/gowalkathome/PvolveMobileTopNav')
})
