import brandData from './brandData'

export var views = [
    {
        path: '/signInUp',
        component: () => import('components/common/SignInUp'),
    },

    {
        path: '/home',
        component: () => import('components/custom/mypvolve/pvolveMobileHome'),
    },

    {
        path: '/beginners',
        component: () => import('components/custom/mypvolve/pvolveBeginners'),
    },

    {
        path: '/library',
        component: () => import('components/custom/mypvolve/pvolveLibrary'),
    },

    {
        path: '/me',
        component: () => import('components/custom/mypvolve/myProfile'),
    },

    {
        path: '/principles',
        component: () => import('components/custom/mypvolve/principles'),
    },

    {
        path: '/onboarding',
        component: () => import('components/custom/mypvolve/pvolveOnboarding'),
    },

    {
        path: '/6day',
        component: () => import('components/custom/mypvolve/sixDayProgram'),
    },

    {
        path: '/3day',
        component: () => import('components/custom/mypvolve/threeDayProgram'),
    },

    {
        path: '/precisionSculpt',
        component: () => import('components/custom/mypvolve/precisionSculpt'),
    },

    {
        path: '/structuredProducts',
        component: () => import('components/custom/mypvolve/pvolveStructuredProductsHome'),
    },

    {
        path: '/30day',
        component: () => import('components/custom/mypvolve/thirtyDayProgram'),
    },

    {
        path: '/21day',
        component: () => import('components/custom/mypvolve/twentyOneDayButtLift'),
    },

    {
        path: '/expressbutt',
        component: () => import('components/custom/mypvolve/buttExpressProgram'),
    },

    {
        path: '/expressthigh',
        component: () => import('components/custom/mypvolve/thighExpressProgram'),
    },

    {
        path: '/armsabs',
        component: () => import('components/custom/mypvolve/armsabs'),
    },

    {
        path: '/beginner-series',
        component: () => import('components/custom/mypvolve/twoWeekBeginnerProgram'),
    },

    {
        path: '/help',
        component: () => import('components/custom/mypvolve/pvolveHelp'),
    },

    {
        path: '/play/:productID2Play',
        component: () => import('components/common/SuperPlayer'),
        props: true,
    },
]

export var brand = Object.assign(brandData, {
    appID: 'com.pvolve.my',
    appName: 'mypvolve',
    brandColor: '#6ebda2',
    brandColorSecondary: '#57c5a4',
    logoFileName: 'mypvolve',
    environmentName: 'mypvolve',
    organizationID: 4453,
    brandURL: 'https://my.pvolve.com/',
    signUpDescription: '',
    signUpMailingListID: '6ba594722b',

    freeProductsRowTitle: 'Free workouts!',
    hideAdvancedControls: true,
    specialProductRoutes: {
        148884: '/30day',
        155386: '/21day',
        148883: '/precisionSculpt',
        150811: '/3day',
        150714: '/6day',
        151753: '/expressbutt',
        151874: '/armsabs',
        155563: '/expressthigh',
        155882: '/beginner-series'
    },
    appStartRoute: '/home',
    validSubscriptionProductIDs: [149001, 148014, 149297, 149320, 149461, 149599, 149297, 150052, 150074, 149755, 150326],

    freeTrialCode: 'appTrial15',
    signUpFreeTrialDescription: 'Sign in with your existing account <br /> OR <br /> sign up below for access to a free 15 day trial!',
    ABTesting: true,

    freeBundleActivationCode: 'pvolveAppFree',
    previewBundleActivationCode: 'pvolveAppFreePreview',
    previewBundleID: 151286,
    freeBundleID: 151287,

    hooks: {
        productComplete: 'pvolveEquipModal',
    },

    includeSocialLogin: {
        facebookAppID: '267816277122496',
        googleAppID: {
            ios: '431032775387-raio3k5jvt1rc64329713me0aoq3opkh.apps.googleusercontent.com',
            android: '431032775387-1esra2lt25fq1g7vjmd7ap0ogbjttg0k.apps.googleusercontent.com',
            web: '431032775387-24k1tjhobtruq7pjsgb1i8rl9i7f7nl4.apps.googleusercontent.com',
        },
        googleProjectID: 'pvolve-214622',
    },

    excludedProductTypes: ['exclusiveContent'],

    tutorialProductOrder: [148818, 151688, 148822, 149438],

    // clientFreeProductCard:  () => import('components/custom/mypvolve/pvolveFreeProductCard'),
    clientTagSidebar: () => import('components/custom/mypvolve/pvolveTagSidebar'),
    clientProductCard: () => import('components/custom/mypvolve/pvolveProductCard'),
    customVideoLayout: () => import('components/custom/mypvolve/pvolveVideoLayout'),
    clientMenu: () => import('components/custom/mypvolve/PvolveRightMenu'),
    clientFooter: () => import('components/custom/mypvolve/pvolveFooter'),
    customTopNav: () => import('components/custom/mypvolve/PvolveMobileTopNav'),

    faq: {
        streaming: [
            {
                question: 'How much does a P.volve streaming membership cost?',
                answer: 'All new members will receive a 15-day free trial! After that, you can get the P.volve experience anytime, anywhere for just $29.99/month.',
            },
            {
                question: 'Do I need any equipment with the subscription service? If so, what do you suggest?',
                answer:
                    'No equipment, no problem. The beauty of P.volve is that you can do every workout with simply your own bodyweight! However, using the equipment will enable you to get the full P.volve experience and achieve optimal results. Check out our blog post on the best equipment for beginners, or save the most money and go all in with our ultimate package!',
            },
            {
                question: 'How can I access streaming?',
                answer: "Click 'Library' in the navigation menu above (or if you need a link: https://my.pvolve.com/library) and log in with your credentials or create an account. ",
            },
            {
                question: 'What devices and browsers can I stream from?',
                answer: 'Whatever your heart desires. The service runs on all browsers, and our app is available on both Apple and Android devices!',
            },
            {
                question: 'How do I navigate the video library?',
                answer: 'You can simply filter the entire library of video content by duration, body focus, ratings and equipment!',
            },
            {
                question: 'How do I cancel my plan?',
                answer:
                    "<p>We're sad to see you go! If you're dissatisfied with your experience in any way, please let us know how we can improve. Then follow the below steps:</p> <p>1. Click 'Account' in the navigation bar (or if you need a link: https://my.pvolve.com/account)</p> <p>2. Sign in (if needed)</p> <p>3. Click 'Account History'</p> <p>4. Click the 'Cancel Auto Renew' button</p> <p>5. You will have access to the subscription through the end of the current billing period.</p>",
            },
            {
                question: 'Do I need to remember to pay each month?',
                answer: 'Nope—all taken care of. Your subscription will auto-renew each month unless you cancel.',
            },
            {
                question: 'How do I change my credit card or billing information?',
                answer: "Once logged in, you are able to edit your billing information under the 'Account' section. ",
            },
            {
                question: 'I forgot my password, what do I do?',
                answer:
                    "It happens, but not to worry. Click 'Sign In' and enter your email like normal. Click 'Continue', and then 'Forgot Password' to get a reset email sent directly to your inbox!",
            },
            {
                question: 'How can I track my goals?',
                answer:
                    "Once logged into your streaming account, visit the 'Me' tab on your personalized dashboard. This is where you can set personal goals, frequency and duration of workouts, and track your progress with body measurements and before & after photos (sharing them with us is optional but highly encouraged—we love to flaunt our client transformations!)",
            },
            {
                question: 'Which workouts should I do each week and how often?',
                answer:
                    'Our streaming library takes the guesswork out of your routine by allowing YOU to create your own personal plan. Simply select the preferred days of the week, duration of workouts, body area of focus and the equipment you have. We will then formulate a workout calendar unique to you! We suggest aiming for 3-4 workouts per week to see results. We also offer more structured Fitness Plans formulated by P, ranging from difficulty, time, and body focus.',
            },
            {
                question: 'Do I need a wi-fi connection to watch the P.volve videos?',
                answer:
                    "Through the P.volve app, you are able to download your favorite videos to take offline, so you can crush your workouts even on a deserted island. Additionally, if you purchase a digital download of any one of P's Fitness Plans, it will save to your computer for ever and ever.",
            },
            {
                question: 'What videos can a customer download?',
                answer:
                    'Depending on what you have purchased (a trial, subscription, or digital download), you can download any video you have access to. For example, if you only purchased the 30-Day Evolution without a streaming subscription, you can download only the 30 Day Evolution videos.',
            },
            {
                question: 'Can I send a downloaded video to a friend?',
                answer:
                    "Your downloaded videos are for your eyes only (even if you tried, they wouldn't be able to view it). However, we'd love for you to invite your friends to stream along with you by sending them a referral link from the 'Account' page! You'll both get a little sumthin-sumthin if they sign up ;)",
            },
            {
                question: 'What happens to my downloaded videos when I cancel my trial or subscription?',
                answer: "It'll be a clean breakup-- all content will be removed from your device.",
            },
            {
                question: 'Do I get any equipment for signing up for the free trial?',
                answer: 'No equipment is included in any streaming trial or subscription.',
            },
            {
                question: 'How do I use the new workout plan?',
                answer: 'When logged into your account, simply visit the home page and scroll down to create your unique workout plan and fill out the questionnaire.',
            },
            {
                question: 'How do I download the app?',
                answer:
                    '<p>Visit the Apple or Android store and search for pvolve:</p><p>https://play.google.com/store/apps/details?id=com.pvolve.my</p><p>https://itunes.apple.com/us/app/p-volve/id1429328712?mt=8</p>',
            },
            {
                question: "I'm confused by the 30-day Challenge series. Can you please explain what the abbreviations mean?",
                answer:
                    "The calendar for the 30-day Challenge explains which videos to do each day, and which days to take a rest. On any day that says 'CE' you should do the entire series, start to finish. On days that specify only MT or SS, you should only do that particular segment of the series along with the warm-up and cool-down.",
            },
            {
                question: 'Can I do P.volve if I am pregnant?',
                answer:
                    'You certainly can! P.volve is perfectly safe for pregnant women, and is actually quite beneficial by  opening up the hips, strengthening the lower back, and keeping your muscles active during this magical time without putting stress on the body. To keep things extra safe for you and your little one, just be cautious to not over-rotate or over-extend, and stick mostly with standing exercises. If doing any mat work, avoid putting pressure on the stomach. ',
            },
            {
                question: 'I have weight to lose, is P.volve right for me?',
                answer:
                    "Our method will certainly help with weight-loss by activating dormant muscles and increasing overall calorie burn without causing stress, inflammation, or swelling. Remember that faster isn't always better, so if you go slow, concentrate and stay engaged, you will really get that heart rate up, as well! Of course, it is absolutely crucial that you pair this method, or any fitness regimen, with a clean, wholesome diet in order to achieve your goals.",
            },
        ],

        methodology: [
            {
                question: 'Is this workout only for women?',
                answer:
                    'The P.volve method is rooted in physical therapy and functional movements, meaning we build strong, lean, natural physiques for all individuals, regardless of gender. Just ask P- he does this workout every day!',
            },
            {
                question: 'Can I perform the workouts in the streaming service if I am slightly injured?',
                answer:
                    'Absolutely. Our method takes a rehab approach so they are all joint friendly! If you have a slight injury you should take it extra slow and always stay within your range of motion. If anything causes further pain, you should stop the exercise immediately & contact your physician.',
            },
            {
                question: 'What results should I be seeing in my first week / first month / first year?',
                answer:
                    "Who doesn't love the 'firsts' in a relationship? We certainly do. In the first week or two, you will start to activate dormant muscles and begin to acclimate to the new motions. In the first month, you should notice more intense engagement in said muscles while your butt starts to take shape, your stomach starts to tighten and your legs begin to lose inflammation. After a year your body should have transformed from head to toe as your muscles will be fully activated and balanced, taking on your natural, sculpted physique.",
            },
            {
                question: 'Can I do cardio with your training? / What cardio do you recommend? ',
                answer:
                    "Mmm... better not. We don't suggest performing any intense cardio with the P.volve program until you have fully activating the glutes, opened up your hips, and created a balanced neuromuscular system. Without this, the intense pressure of high cardio will go straight into your thighs and create swelling, not to mention send pressure directly into your joints. We tell our clients to give it 3-4 months before starting your cardio regimen up again. If you like to do cardio, we suggest walking on an incline or rowing!",
            },
            {
                question: "I keep hearing you use the word 'sit' and not 'squat', what is the difference?",
                answer:
                    "Squats don't exist in the P.volve method. Squats can end up pushing into your knees and taking the exercise away from the glutes and into the quads, which leads to bulking and a quad dominant neuromuscular effect (aka Droopy Butt Syndrome). In P.volve, the foundational move is a 'P.sit,' which involves pushing your butt back and down 1-3 inches, knees back in line with your heels (think chair pose), pausing when you feel your glutes engage, and then pushing back up from the glutes. The P.sit is also one of the best ways to tighten your lower stomach, as the smaller range of motion will keep your glutes and lower stomach engaged, further accelerating your results. You can check out our P.sit tutorial on our YouTube channel here.",
            },
            {
                question: 'Can I do other workout programs along with yours? If so, which ones do you recommend?',
                answer:
                    "Let's be exclusive. We do not recommend other styles of training while doing this method to truly see the best results. Within the P.volve method, we are trying to reduce inflammation and bulk, while creating strong, lean, and balanced muscles. Most other programs counteract all the work we are doing by putting pressure back into the muscles and joints we just worked so hard to eliminate.",
            },
            {
                question: 'I notice you never repeat the same exercise. Is this on purpose? How many reps should I be doing?',
                answer:
                    "To repeat or not to repeat, that is the question. In P.volve, we don't repeat moves throughout the workout. Rather than repeating certain moves, we do each move on both sides of the body for 6-8 reps and then move on. This is to make sure we don't plateau and are continuously pushing our bodies. By performing low reps, we ensure the focus is on keeping perfect form, rather than forcing more reps at the risk of injury. Fewer reps also allow for more movements during the workout, working the body as dynamically as possible.",
            },
        ],
    },
})
