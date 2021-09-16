<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/fixtures">Fixtures</router-link> |
    <router-link to="/leaderboard">Leaderboard</router-link> |
    <router-link v-if="!isFirstTeamReady" to="/starter-store">Starter Store</router-link> |
    <router-link v-if="isFirstTeamReady" to="/inventory"> Inventory</router-link> |
    <button v-if="isLoggedIn" @click= "logout">Logout</button>
    <button v-else @click= "login">Login</button>

  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

button {
  display: inline-block;
  outline: 0;
  border: 0;
  cursor: pointer;
  background-color: #4299e1;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  line-height: 26px;              
}
</style>
<script>
  import * as nearAPI from 'near-api-js';
  import getConfig from './config.js';
  import axios from 'axios';
  export default {
      data() {
          return {
            isLoggedIn : false,
            currentUser : null,
            walletConnection : null,
            isFirstTeamReady : false,
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
              const postData = { account_id: this.walletConnection.getAccountId(), };
              await axios
                .post("http://127.0.0.1:9090/account", postData)
            }
          },
          async login(){
            await this.walletConnection.requestSignIn(
              'zairn_contract3.testnet',
              'DFPL'
            );
          },
          async logout(){
            this.walletConnection.signOut();
            window.location = '/';
          },
          showAlert(){
            this.$swal('Hello Vue world!!!');
          },
          checkFirstTeam(){
            return axios.get("http://127.0.0.1:9090/token/series/owner/"+this.currentUser.accountId)
                  .then(res => {
                    return res.data.data.length > 2;
                  })
          },
          async firstTeamCheck(){
            if(this.isLoggedIn){
              const firstTeamReady = await this.checkFirstTeam();
              if(firstTeamReady){
                this.isFirstTeamReady = true;
              }
            }
          }
      },
      async created(){
        await this.loggedInCheck();
        this.firstTeamCheck();
      },
    }
</script>
