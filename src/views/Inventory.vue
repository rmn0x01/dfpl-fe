<template>
  <div class="inventory">
    <div>
        <li v-for="(player) in players" :key="player.name">
          <img :src="`${player.imgUri}`" style="width:20%;height:20%"> <br>
          {{ player.name }} ({{ player.multiplier }})
          <button v-if="!player.isFinalized" @click.prevent="finalize(player.tokenId)"> Finalize </button>
          <!-- <button v-else@click.prevent="unfinalize(player.tokenId)"> Unfinalize </button> -->
        </li>
    </div>
  </div>
</template>
<script>
    import * as nearAPI from 'near-api-js';
    import getConfig from '../config.js';
    import axios from 'axios';
    export default {
        data(){
            return {
                isLoggedIn : false,
                currentUser : null,
                walletConnection : null,
                isRoot     : false,
                players: [],
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
                if(this.currentUser.accountId == 'zairn.testnet'){ //config / call api
                    this.isRoot = true;
                }
                } else {
                    window.location = '/';
                }
            },
            async getPlayer(){
                return axios.get("http://127.0.0.1:9090/inventory/"+this.currentUser.accountId)
                        .then(res => {
                        return (res.data.data);
                        });
            },
            async importPlayer(){
                if(this.isLoggedIn){
                    const inventory = await this.getPlayer();
                    for (let i = 0; i < inventory.length;i++){
                        // {name: "David de Gea", imgUri:  "https://resources.premierleague.com/premierleague/photos/players/250x250/p51940.png"},
                        let playerCard = {
                            name    : inventory[i].title,
                            imgUri  : inventory[i].media,
                            tokenId : inventory[i].token_id,
                            isFinalized : inventory[i].is_finalized,
                            multiplier  : inventory[i].multiplier_value,
                        };
                        this.players.push(playerCard);
                    }
                }
            },
            async finalize(tokenId){
                const contract = await new nearAPI.Contract(
                this.walletConnection.account(),
                'zairn_contract3.testnet',
                {
                    viewMethods: ['nft_get_series_single'],
                    changeMethods: [
                    'nft_create_series',
                    'nft_buy',
                    'nft_finalize',

                    ],
                    sender: this.walletConnection.getAccountId(),
                }
                );
                try {
                await contract.nft_finalize(
                    {
                        token_id : tokenId
                    },
                    '300000000000000', // attached GAS (optional)
                    '2000000000000000000000000' // attached deposit in yoctoNEAR (optional)
                )
                } catch (err) {
                console.log(err)
                }
            }
        },
        async created(){
            await this.loggedInCheck();
            await this.importPlayer();
        },
    }
</script>
<style scoped>
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
