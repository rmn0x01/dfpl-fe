<template>
  <div class="starter">
    <div>
      <li v-for="(team) in teams" :key="team.team_id">
        <div>
          <img :src="`${team.team_img}`" style="width:100px;height:100px" @click="getPlayers(team.team_id)"> <br>
          {{ team.team_nm }}
        </div>
      </li>
    </div>
    <div v-if="isRoot">
        <li v-for="(player) in players" :key="player.player_id">
          <img :src="`${player.player_img}`" style="width:20%;height:20%"> <br>
          {{ player.player_nm }}
          <label for="copies"> Total Copies</label> <br>
          <input type="number" v-model="copies" required>
          <button @click.prevent="testGenerate(player.player_id)"> Generate </button>
        </li>
    </div>
    <div v-else>
        <li v-for="(player) in players" :key="player.player_id">
          <img :src="`${player.player_img}`" style="width:20%;height:20%"> <br>
          {{ player.player_nm }}
          <button @click.prevent="testBuy(player.player_id)"> Buy </button>
        </li>
    </div>
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
            isRoot     : false,
            copies     : 1,
            players: [],
            teams: [],
            selectedTeam: null,
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
          checkIfExist(tokenId){
            //TODO validasi ditaruh di smart contract
            return axios.get("http://127.0.0.1:9090/token/id/"+tokenId)
                    .then(res => {
                      return (res.data.status == 1) ? true : false;
                    });
          },
          checkIfBought(tokenId){
            //TODO validasi ditaruh di smart contract
            console.log(tokenId);
            return axios.get("http://127.0.0.1:9090/token/series/owner/"+this.currentUser.accountId)
                  .then(res => {
                    return res.data.data.includes(tokenId);
                  })
          },
          async testGenerate(playerId){
            const tokenId = (playerId+1).toString();
            const title = this.players[playerId].player_nm;
            const media = this.players[playerId].player_img;
            const copies = this.copies;
            const exist = await this.checkIfExist(tokenId);
            if(!exist){
              await this.customGenerate(tokenId,title,media,copies);
            } else {
              alert("Series have already been created");
            }
          },
          async customGenerate(tokenId,title,media,copies){
            const contract = await new nearAPI.Contract(
              this.walletConnection.account(),
              'zairn_contract3.testnet',
              {
                viewMethods: ['nft_get_series_single'],
                changeMethods: [
                  'nft_create_series',
                  'nft_buy',

                ],
                sender: this.walletConnection.getAccountId(),
              }
            );
            try {
              await contract.nft_create_series(
                {
                    token_metadata : {
                        'title' : title,
                        'description' : 'EPL Player - ' + tokenId,
                        'media' : media,
                        'copies' : copies,
                        'extra' : '{"is_finalized":false,"multiplier_value":1}',
                    },
                    price : "1000000000000000000000000",
                },
                '300000000000000', // attached GAS (optional)
                '1000000000000000000000000' // attached deposit in yoctoNEAR (optional)
              )
            } catch (err) {
              console.log(err)
            }
          },
          async testBuy(playerId){
            const tokenId = (playerId+1).toString();
            const exist = await this.checkIfExist(tokenId);
            if(exist){
              const haveSeries = await this.checkIfBought(tokenId);
              if(haveSeries){
                alert("Already bought")
              } else {
                if(confirm("Buy this card?")){
                  await this.customBuy(tokenId);
                }
              }
            } else {
              alert("Series Unavailable");
            }
          },
          async customBuy(tokenId){
            const contract = await new nearAPI.Contract(
              this.walletConnection.account(),
              'zairn_contract3.testnet',
              {
                viewMethods: ['nft_get_series_single'],
                changeMethods: [
                  'nft_create_series',
                  'nft_buy',

                ],
                sender: this.walletConnection.getAccountId(),
              }
            );
            try {
              await contract.nft_buy(
                {
                    token_series_id : tokenId,
                    receiver_id     : this.currentUser.accountId,
                },
                '300000000000000', // attached GAS (optional)
                '2000000000000000000000000' // attached deposit in yoctoNEAR (optional)
              )
            } catch (err) {
              console.log(err)
            }
          },
          async getTeams(){
            axios.get("http://127.0.0.1:9090/teams")
                    .then(res => {
                      const allTeams = res.data.data;
                      for(let i = 0; i < allTeams.length; i++){
                        let team = {
                          team_id: allTeams[i].teamId,
                          team_nm: allTeams[i].teamNm,
                          team_img: allTeams[i].teamImg,
                        };
                        this.teams.push(team);
                      }
                    });
          },
          async getPlayers(teamId){
            this.players = [];
            axios.get("http://127.0.0.1:9090/players/" + teamId)
                    .then(res => {
                      const allPlayers = res.data.data;
                      for(let i = 0; i < allPlayers.length; i++){
                        let player = {
                          player_id: allPlayers[i].playerId,
                          player_nm: allPlayers[i].playerNm,
                          player_img: allPlayers[i].playerImg,
                        };
                        this.players.push(player);
                      }
                    });
          }
      },
      created(){
        this.loggedInCheck();
        this.getTeams();
      },
    }
</script>
<style scoped>
li {
  display: inline-block;
  margin: 0 10px;
}
input {
  box-shadow: inset #abacaf 0 0 0 2px;
  border: 0;
  background: rgba(0, 0, 0, 0);
  appearance: none;
  width: 50%;
  position: relative;
  border-radius: 3px;
  padding: 9px 12px;
  margin-right: 10px;
  line-height: 1.4;
  color: rgb(0, 0, 0);
  font-size: 16px;
  font-weight: 400;
  height: 25px;
  transition: all .2s ease;           
}
</style>