import brandData from './brandData';

export var views = [{
        path: '/',
        component: () =>
            import ('components/custom/discoveryekb/Home')
    },

    {
        path: '/curriculumConnect',
        component: () =>
            import ('components/custom/discoveryekb/CurriculumConnect')
    },

    {
        path: '/webEdTV',
        component: () =>
            import ('components/custom/discoveryekb/WebEdTV')
    },

    {
        path: '/searchResults',
        redirect: '/'
    },

    {
        path: '/searchResults/:searchTerm',
        component: () =>
            import ('components/custom/discoveryekb/SearchResults'),
        props: true
    },

    {
        path: '/play/:productID2Play',
        component: () =>
            import ('components/common/SuperPlayer'),
        props: true
    },

    {
        path: '/library',
        redirect: '/'
    },

    {
        path: '/downloads/:searchTerm',
        component: () =>
            import ('components/custom/discoveryekb/Downloads'),
        props: true
    },

    {
        path: '/downloads',
        component: () =>
            import ('components/custom/discoveryekb/Downloads')
    },

    {
        path: '/signInUp',
        redirect: '/'
    }
]

export var brand = Object.assign(brandData, {
    appID: 'com.platformpurple.discoveryekb',
    defaultLocale: 'ar',
    brandColor: '#565088',
    brandColorSecondary: '#565088',
    logoFileName: 'purple',
    environmentName: 'ekb',
    // freeBundleActivationCode: 'myWalkTVApp',
    // previewBundleActivationCode: 'myWalkTVAppPreview',
    brandURL: 'https://go.platformpurple.com/',
    signUpDescription: '',
    // subscriberIDs: [109776, 109777, 148783, 149295, 149296],
    // previewBundleID: 150413,
    // freeBundleID: 149196,
    // clientMenu: 'YDWRightMenu',
    hideAdvancedControls: true,
    messages: {
        en: {
            presents: 'presents',
            howToUseSectionTitle: 'How to use Discovery Education Offline:',
            steps: [{
                header: 1,
                title: 'Find resources',
                text: 'Use Curriculum Connect, WebEdTV or search to find educational resources.',
                backgroundColor: '#7581c2',
                screenshot: 'search.jpg'
            }, {
                header: 2,
                title: 'Download resources',
                text: 'Click on the arrow to download a resource to your device so you can access it offline.',
                backgroundColor: '#66cdc6',
                screenshot: 'download.jpg'
            }, {
                header: 3,
                title: 'Access downloaded resources',
                text: 'Go to Downloads to access your resources, even when offline.',
                backgroundColor: '#90bbe3',
                screenshot: 'offline.jpg'
            }],
            moreInfoSectionTitle: 'More information about Discovery Education and the Egyptian Knowledge Bank:',
            halfImageSections: [{
                title: 'Discovery Education',
                text: 'In partnership with the Egyptian Knowledge Bank, you\'re invited to explore videos, games, and other exciting educational content powered by the #1 non-fiction media company in the world. Teachers, students, and parents have exclusive access to Curriculum Connect and WebEdTV, unique resources fully customised to support an Egyptian community learns, thinks, and innovates.',
                image: 'logo-large.png',
                button: {
                    label: 'Visit our website',
                    link: 'http://en.discoveryeducation.ekb.eg'
                }
            }, {
                title: 'Egyptian Knowledge Bank',
                text: 'The Egyptian Knowledge Bank is a national initiative from the Presidential Specialised Council for Education and Scientific Research granting all Egyptians access to the largest free digital educational database in the world. Discovery Education is proud to be the most active partner for primary, preparatory, and secondary grade ranges.',
                image: 'knowledge-bank.jpg',
                button: {
                    label: 'Visit Egyptian Knowledge Bank',
                    link: 'http://ekb.eg/home'
                }
            }],
            "previous_weeks": "Previous weeks",
            "current_week": "Current week",
            "upcoming_weeks": "Upcoming weeks",
            "explore_online": "Explore our resources",
            "explore_offline": "SEARCH IN LIBRARY",
            "search": "Search",
            "online": "Online",
            "offline": "Offline",
            "downloads": "Downloads",
            "primary": "Primary",
            "preparatory": "Preparatory",
            "secondary": "Secondary",
            "download_all": "Download All",
            "downloaded": "Downloaded",
            "back_to_library": "Back to Library",
            "load_more": "Load More",
            "settings": "Settings",
            "media_storage_location": "Current media storage location",
            "change": "Change",
            "restore_defaults": "Restore Defaults",
            "version": "Version Information",
            "no_downloads_yet": "You have no downloads yet",
            "webed_offline": "WebEdTV is not available while you are offline",
            "cc_offline": "Curriculum Connect is not available while you are offline",
            "loading_issue": "There was an issue loading your content.",
            "try_again": "Try Again",
            "moving_library": "Moving your library",
            "might_take_a_few": "This might take a few minutes",
            "file": "file",
            "select_syt": "Select subject, year and term to see results",
            "select": "Select",
            "filter_by": "Filter By",
            "grades": "Grades",
            "resource_type": "Resource type",
            "select_year": "Select Year",
            "select_term": "Select Term",
            "select_subject": "Select Subject",
            "no_results": "No results were found",
            "no_results_found_for": "No results found for",
            "content_restricted": "This content is not available in your country",
            "content_expired": "This content has expired. Please go online to restore access",
            "clear_queue": "Clear Queue",
            "resume_downloads": "Resume Downloads",
            "pause_downloads": "Pause Downloads",
            "paused": "Paused",
            "queued": "Queued",
            "see_all": "<< See All",
            "of": "of",
            "curriculumConnect": {
                title: 'Curriculum Connect',
                main: 'Connecting the Egyptian curriculum to engaging digital content. Teachers no longer need to search extensively for digital resources to support their lessons and students can study in confidence. Curriculum Connect provides online and mobile access to thousands of vetted videos, text articles, interactives, audio files, and images mapped to all Science and Maths lessons for all grade levels.'
            },
            "Help": "Help",
            "DOWNLOADING": "DOWNLOADING",
            "Please wait until all downloads finish to change download location!": "Please wait until all downloads finish to change download location!",
            "Clear Download Queue": "Clear Download Queue",
            "Are you sure you want to remove this item?": "Are you sure you want to remove this item?",
            "Yes": "Yes",
            "Cancel": "Cancel",
            "Use External Storage": "Use External Storage",
            "You have selected to stop using internal storage.": "You have selected to stop using internal storage.",
            "You have selected to stop using external storage.": "You have selected to stop using external storage.",
            "If you have any items that were downloaded externally, you will lose access. Would you like to continue?": "If you have any items that were downloaded externally, you will lose access. Would you like to continue?",
            "If you have any items that were downloaded internally, you will lose access. Would you like to continue?": "If you have any items that were downloaded internally, you will lose access. Would you like to continue?"
        },

        ar: {
            presents: 'يقدم',
            howToUseSectionTitle: 'كيفية استخدام تطبيق Discovery Education Offline',
            steps: [{
                header: 1,
                title: 'ااالبحثعن ااالموار',
                text: 'استخدم خدمة Curriculum Connect ، أو شبكة WebEdTV للبحث عنالموارد التعليمية.',
                backgroundColor: '#7581c2',
                screenshot: 'search.jpg'
            }, {
                header: 2,
                title: 'تاانازيل ااالموارد',
                text: 'انقر فوق السهم لتنزيل أحد الموارد إلى جهازك',
                backgroundColor: '#66cdc6',
                screenshot: 'download.jpg'
            }, {
                header: 3,
                title: 'ااالوصول إاالى ااالموارد  ااالتي تاام  تاانازيلهاا',
                text: 'ملف Downloads (التنزيلت) للوصول إلى الموارد، حتى في وضع عدم التصال بالنترنت.',
                backgroundColor: '#90bbe3',
                screenshot: 'offline.jpg'
            }],
            moreInfoSectionTitle: 'معلومات إضافية عن Discovery Education وبنك المعرفة المصري.',
            halfImageSections: [{
                title: '',
                text: 'أنت مدعو، في إطار الشراكة مع بنك المعرفة المصري، إلى استكشاف مقاطع الفيديو، والألعاب، وغيرها من المحتوى التعليمي المشوق المدعوم من خلال الشركة الإعلامية الواقعية رقم 1 في العالم. ولدى كل من المعلمين، والطلاب، وأولياء الأمور حق وصول خاص إلى Curriculum Connect وWebEdTV، وهما عبارة عن موارد فريدة مخصصة بالكامل لدعم مجتمع مصري يتعلم، ويفكر، ويبتكر.',
                image: 'logo-large.png',
                button: {
                    label: 'تفضلوا بزيارة موقع الويب الخاص بنا',
                    link: 'http://discoveryeducation.ekb.eg'
                }
            }, {
                title: 'بنك المعرفة المصري (EKB)',
                text: 'بنك المعرفة المصري هو مبادرة وطنية من المجلس الرئاسي المتخصص للتعليم والبحث العلمي لمنح جميع المصريين حق الوصول إلى أكبر قاعدة بيانات تعليمية رقمية مجانية في العالم. وتفخر Discovery Education بأن تكون الشريك الأكثر نشاطًا في نطاق المراحل الابتدائية، والإعدادية، والثانوية.',
                image: 'knowledge-bank.jpg',
                button: {
                    label: 'تفضل بزيارة بنك المعرفة المصري',
                    link: 'http://ekb.eg/ar/home/'
                }
            }],
            "previous_weeks": "الأسابيع السابقة",
            "current_week": "الأسبوع الحالي",
            "upcoming_weeks": "الأسابيع القادمة",
            "explore_online": "استكشاف مواردنا",
            "explore_offline": "البحث في المكتبة",
            "search": "بحث",
            "online": "متصل",
            "offline": "دون اتصال",
            "downloads": "تنزيلات",
            "primary": "الابتدائي",
            "preparatory": "الإعدادي",
            "secondary": "الثانوي",
            "download_all": "تنزيل الكل",
            "downloaded": "تم التنزيل",
            "back_to_library": "رجوع إلى المكتبة",
            "load_more": "تحميل المزيد",
            "settings": "إعدادات",
            "media_storage_location": "موقع تخزين الوسائط الحالي",
            "change": "تغيير",
            "restore_defaults": "استعادة الافتراضيات",
            "version": "معلومات الإصدار",
            "no_downloads_yet": "ليس لديك أي تنزيلات",
            "webed_offline": "خدمة WebEdTV غير متوفرة في وضع عدم الاتصال بالإنترنت.",
            "cc_offline": "خدمة Curriculum Connect غير متوفرة في وضع عدم الاتصال بالإنترنت.",
            "loading_issue": "حدث خطأ في تحميل المحتوى.",
            "try_again": "أعِد المحاولة",
            "moving_library": "نقل المكتبة",
            "might_take_a_few": "قد يستغرق ذلك بضع دقائق",
            "file": "ملف",
            "select_syt": "حدد المادة، والصف، والفصل الدراسي لمشاهدة النتائج.",
            "select": "تحديد",
            "filter_by": "فرز حسب",
            "grades": "المستوىالدراسي",
            "resource_type": "نوع المورد",
            "select_year": "حدد الصف الدراسي",
            "select_term": "حدد الفصل الدراسي",
            "select_subject": "حدد المادة",
            "no_results": "لم يتم العثور على أي نتائج",
            "no_results_found_for": "لم يتم العثور على نتائج تخص",
            "content_restricted": "هذا المحتوى غير متوفر في دولتك.",
            "content_expired": "انتهت صلاحية المحتوى. برجاء الاتصال بالإنترنت لاستعادة إمكانية الوصول.",
            "clear_queue": "مسح قائمة الانتظار",
            "resume_downloads": "استئناف التنزيلات",
            "pause_downloads": "إيقاف مؤقت للتنزيلات",
            "paused": "متوقف مؤقتًا",
            "queued": "في قائمة الانتظار",
            "see_all": "<< مشاهدة الكل",
            "of": "من",
            "curriculumConnect": {
                title: 'Curriculum Connect',
                main: 'ربط المنهج المصري بمحتوى رقمي ممتع. فلم يعد المعلمون بحاجة للبحث على نطاق واسع عن موارد رقمية لدعم دروسهم ويمكن للطلاب دراستها سرًا. يوفر Curriculum Connect الوصول عبر الإنترنت وعبر الهاتف المحمول إلى الآلاف من مقاطع الفيديو، والمقالات النصية، والعروض التفاعلية، وملفات الصوت، والصور المدققة التي تم تعيينها إلى كل دروس العلوم والرياضيات لجميع المراحل الدراسية'
            },
            "Help": "قائمة المساعدة",
            "DOWNLOADING": "التحميل",
            "Please wait until all downloads finish to change download location!": "من فضلك انتظر حتى يتم التحميل ليتم تغيير مكان التحميل",
            "Clear Download Queue": "قم بمسح قائمة التنزيل",
            "Are you sure you want to remove this item?": "هل انت متاكد من رغبتك في ازالة هذا العنصر؟",
            "Yes": "نعم فعلا",
            "Cancel": "إلغاء",
            "Use External Storage": "استخدم وسيلة تخزين خارجية",
            "You have selected to stop using internal storage.": "لقد قمت بوقف استخدام مساحة التخزين الداخلية.",
            "You have selected to stop using external storage.": "لقد قمت بوقف استخدام مساحة التخزين الخارجية.",
            "If you have any items that were downloaded externally, you will lose access. Would you like to continue?": " ستفقد امكانية الوصول للمحتوى الذي قمت بتحميله بشكل",
            "If you have any items that were downloaded internally, you will lose access. Would you like to continue?": "ستفقد امكانية الوصول للمحتوى الذي قمت بتحميله. هل ترغب في المتابعة؟",
        }
    },
    customTopNav: () =>
        import ('components/custom/discoveryekb/TopNav'),
    clientMenu: () =>
        import ('components/custom/discoveryekb/RightMenu'),
    customAudioLayout: () =>
        import ('components/custom/discoveryekb/AudioLayout'),
    // customVideoLayout: () =>
    //     import ('components/custom/discoveryekb/VideoLayout')
})
