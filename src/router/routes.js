
const views = require(process.env.BRAND_INDEX_FILE).views

export default [
    {
        path: '/',
        component: () => import('pages/index'),
        children: views
    }
]

// export default [
//   {
//     path: '/',
//     component: () => import('layouts/default'),
//     children: [
//       { path: '', component: () => import(`pages/${process.env.CLIENT}`) }
//     ]
//   },

//   { // Always leave this as last one
//     path: '*',
//     component: () => import('pages/404')
//   }
// ]
