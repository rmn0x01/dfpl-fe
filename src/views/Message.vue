<template>
  <div class="message">
    <h1>Write A Message</h1>
    <input type="text" v-model="message" placeholder="message" required>
    <button @click.prevent="send"> Send Message</button>
  </div>
</template>
<script>
  import * as nearAPI from 'near-api-js';
  import getConfig from '../config.js';
  import axios from 'axios';
  export default {
      data() {
          return {
            isLoggedIn : false,
            currentUser : null,
            walletConnection : null,
            message : "",
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
            } else {
                window.location = '/';
            }
          },
          send(){
            const postData = { message: this.message };
            console.log(postData);
            axios
              .post("http://127.0.0.1:9090/message", postData)
              .then(res => {alert(res.data.data.message);});
          }
      },
      created(){
        this.loggedInCheck();
      },
    }
</script>
