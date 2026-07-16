export const environment = {
  production: false,
  nodeBackendUrl: '', // In dev, we keep this empty so it uses proxy.conf.js
  erpBaseUrl: '', // In dev, we keep this empty so it uses proxy.conf.js
  baseAPIURL: '',
  fileBaseURL: '',
  loginEndpoint: 'api/method/login',
  productsEndpoint: 'all-products',
  websiteItemEndpoint: 'api/resource/Website%20Item',
  razorpayKey: 'rzp_live_mXMqD6Uq31IPNc',
  firebase: {
    apiKey: "AIzaSyDaWAOPDZeATTSL7kQ-CDkbFstyvpTMkNM",
    authDomain: "hr-poc-cdec5.firebaseapp.com",
    projectId: "hr-poc-cdec5",
    storageBucket: "hr-poc-cdec5.appspot.com",
    messagingSenderId: "348496003604",
    appId: "1:348496003604:web:5cb59a6f7851c5d0279d01",
    measurementId: "G-D9B88Z16TC"
  }
};
