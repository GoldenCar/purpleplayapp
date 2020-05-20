// Configuration for your app
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const BRAND_NAME = process.env.npm_package_currentBrand

const brandDataLocation = `./brands/${BRAND_NAME}/brandData.js`
const brandData = require(brandDataLocation)

const publishFolder = `/purplePlay/${BRAND_NAME}/${process.env.PUBLISH_LIVE ? 'live' : 'dev'}`

const builderConfig = {
  appId: `com.platformpurple.${brandData.appName}`,
  protocols: [{
    'name': brandData.appName,
    'schemes': [brandData.appName]
  }],
  productName: process.env.PUBLISH_LIVE ? brandData.appDisplayName : `${brandData.appDisplayName}-dev`,
  mac: {
    publish: {
      provider: "spaces",
      name: "purplespace",
      region: "nyc3",
      path: `${publishFolder}/mac`
    },
  },
  win: {
    publish: {
      provider: "spaces",
      name: "purplespace",
      region: "nyc3",
      path: `${publishFolder}/win`
    },
    target: [{
      target: "nsis",
      arch: [
        "x64",
        "ia32"
      ]
    }]
  },
  afterPack(config) {
    const packageLocation = path.join(config.outDir, '../Unpackaged/package.json');
    let packageContent = fs.readFileSync(packageLocation, 'utf-8');
    packageContent = JSON.parse(packageContent);
    packageContent.build = builderConfig;
    fs.writeFileSync(packageLocation, JSON.stringify(packageContent, null, 2));

    if (!fs.existsSync(path.join(config.outDir, '../Unpackaged/icons'))) {
      fs.mkdirSync(path.join(config.outDir, '../Unpackaged/icons'));
      fs.writeFileSync(path.join(config.outDir, '../Unpackaged/icons/linux-512x512.png'), fs.readFileSync(path.join(__dirname, 'src-electron/icons/linux-512x512.png')));
    }
  }
}

module.exports = function (ctx) {
  console.log('CONTEXT MODE: ')
  console.log(ctx.mode)
  return {
    // app plugins (/src/plugins)
    plugins: [
      'fileManager',
      // ctx.mode && ctx.mode.electron ? 'fileManagerElectron': null,
      // ctx.mode && ctx.mode.cordova ? 'fileManagerCordova': null,
      ctx.mode && ctx.mode.electron ? 'electronRenderProcess' : null,
      'eJSON',
      'api',
      'j_',
      'main',
      'store',
      'vue-i18n',
      'moment',
      'velocity',
      'VueTheMask',
      'deepLinking',
      'injection',
      'fileMutation'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      // 'ionicons',
      // 'mdi',
      'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      env: {
        BRAND_INDEX_FILE: JSON.stringify(`../../brands/${BRAND_NAME}/index.js`),
        CURRENT_BRAND: JSON.stringify(BRAND_NAME),
        APP_NAME: JSON.stringify(brandData.appName),
      },
      productName: brandData.appDisplayName,

      files: [
        './dist/**/*',
        './src-electron/main-process/electron-main.js'
      ],
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        // get list of brands
        let customComponentBrands = fs.readdirSync(path.join(__dirname, 'src/components/custom'))

        // filter only directories
        customComponentBrands = customComponentBrands.filter(source => fs.lstatSync(path.join(__dirname, 'src/components/custom', source)).isDirectory());

        // exclude the current brand
        customComponentBrands = customComponentBrands.filter(brand => brand !== BRAND_NAME)

        // exclude the remaining brands from final bundle
        cfg.module.rules[0].exclude = customComponentBrands.map(brand => path.resolve(__dirname, `src/components/custom/${brand}`))
      }
    },
    devServer: {
      // https: true,
      port: 8088,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QLayoutFooter',
        'QPageContainer',
        'QWindowResizeObservable',
        'QScrollObservable',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnGroup',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemSeparator',
        'QItemMain',
        'QItemSide',
        'QInput',
        'QField',
        'QTabs',
        'QTab',
        'QRouteTab',
        'QTabPane',
        'QItemTile',
        'QModalLayout',
        'QModal',
        'QToggle',
        'QInnerLoading',
        'QCard',
        'QCardMain',
        'QCardMedia',
        'QCardTitle',
        'QSelect',
        'QSearch',
        'QSpinner',
        'QSlideTransition',
        'QCheckbox',
        'QProgress',
        'QDatetime',
        'QDatetimePicker',
        'QCollapsible',
        'QChip',
        'QScrollArea',
        'QTooltip',
        'QPageSticky'
      ],
      directives: [
        'Ripple',
        'ScrollFire',
        'BackToTop',
        'TouchSwipe',
        'TouchHold'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Loading',
        'Dialog',
        'ActionSheet'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [{
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      buildResources: 'icons',
      bundler: 'builder',
      builder: builderConfig,
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0'
  }
}
