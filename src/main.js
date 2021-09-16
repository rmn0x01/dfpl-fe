import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
// import i18nPlugin from './plugins/i18n'
// import MyPlugin from './plugins/my-vue-plugin'

// const i18nStrings = {
//     greetings: {
//       hi: 'Hallo!'
//     }
//   }


// Initializing connection to the NEAR TestNet
// const near = await nearAPI.connect({
//   deps: {
//     keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
//   },
//   ...nearConfig
// });
// // Needed to access wallet
// const walletConnection = new nearAPI.WalletConnection(near);
// // Load in account data
// let currentUser;
// if(walletConnection.getAccountId()) {
//   currentUser = {
//     accountId: walletConnection.getAccountId(),
//     balance: (await walletConnection.account().state()).amount
//   };
// }
// // Initializing our contract APIs by contract name and configuration
// const contract = await new nearAPI.Contract(walletConnection.account(), nearConfig.contractName, {
//   // View methods are read-only – they don't modify the state, but usually return some value
//   viewMethods: ['getMessages'],
//   // Change methods can modify the state, but you don't receive the returned value when called
//   changeMethods: ['addMessage'],
//   // Sender is the account ID to initialize transactions.
//   // getAccountId() will return empty string if user is still unauthorized
//   sender: walletConnection.getAccountId()
// });

// createApp(App).use(i18nPlugin, i18nStrings, router).mount('#app')
createApp(App).use(router, VueSweetalert2).mount('#app')
