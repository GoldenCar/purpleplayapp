import brandData from "./brandData";

export var views = [
  {
    path: "/signInUp",
    component: () => import("components/common/SignInUp")
  },

  {
    path: "/library",
    component: () => import("components/common/Library")
  },

  {
    path: "/play/:productID2Play",
    component: () => import("components/common/SuperPlayer"),
    props: true
  }
];

export var brand = Object.assign(brandData, {
  appID: "com.platformpurple.homespun",
  appName: "homespun",
  brandColor: "#440810",
  brandColorSecondary: "#8B1E2E",
  logoFileName: "homespun",
  environmentName: "homespun",
  organizationID: 4453,
  brandURL: "https://go.platformpurple.com/?e=homespun",
  signUpDescription: "",
  freeProductsRowTitle: "Free content!",
  freeBundleActivationCode: "",
  previewBundleActivationCode: "",
  previewBundleID: null,
  freeBundleID: null
});
