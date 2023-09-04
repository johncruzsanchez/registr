// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



import { initializeApp } from 'firebase/app';

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyDUH1Nt4U2LyCJCLmlu37ah8xby2pDhRBY",
    authDomain: "registr-6cd30.firebaseapp.com",
    projectId: "registr-6cd30",
    storageBucket: "registr-6cd30.appspot.com",
    messagingSenderId: "185834797744",
    appId: "1:185834797744:web:59d1203d9d722da6959975"
  }
};

initializeApp(environment.firebaseConfig);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
