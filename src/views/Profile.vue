<template>
  <div class="profile">
    <h1>Profile page for {{ $route.params.id }}</h1>
    <button @click="logged"> Login Check</button>
  </div>
</template>
<script>
  import * as nearAPI from 'near-api-js';
  import getConfig from '../config.js';
  export default {
      data() {
          return {
            isLoggedIn : false,
            currentUser : null,
            walletConnection : null,
          }
      },
      methods: {
          async loggedInCheck(){
            const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');
            // Initializing connection to the NEAR TestNet
            const near = await nearAPI.connect({
              deps: {
                keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
              },
              ...nearConfig
            });
            // Needed to access wallet
            this.walletConnection = new nearAPI.WalletConnection(near);
            // Load in account data
            if(this.walletConnection.getAccountId()) {
              this.currentUser = {
                accountId: this.walletConnection.getAccountId(),
                balance: (await this.walletConnection.account().state()).amount
              };
              this.isLoggedIn = true;
            }
          },
          async logged(){
              alert(this.isLoggedIn);
          }
      },
      created(){
        this.loggedInCheck();
      },
    }
</script>
