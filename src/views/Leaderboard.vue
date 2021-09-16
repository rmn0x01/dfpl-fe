<template>
    <div class="box">
        <select v-model="gameweek" @change="getDetailLeaderboard">
            <option value="">Choose Gameweek</option>
            <option v-for="gameweek in totalGameweek" :key="gameweek" :value="gameweek"> Gameweek {{gameweek}} </option>
        </select>
    </div>
    <div>
        <table class="tg">
            <thead>
            <tr>
                <th class="tg-0lax">AccountId</th>
                <th class="tg-0lax">Score</th>
            </tr>
            </thead>
            <tbody v-for="(detail) in leaderboardDetails" :key="detail.id">
            <tr>
                <td class="tg-0lax">{{detail.accountId}}</td>
                <td class="tg-0lax">{{detail.score }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<style type="text/css" scoped>
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                gameweek : "",
                leaderboardDetails : [],
                totalGameweek : 0,
            }
        },
        methods: {
            async getDetailLeaderboard(){
                this.leaderboardDetails = [];
                axios.get("http://127.0.0.1:9090/leaderboard/"+this.gameweek)
                    .then(res => {
                        let details =res.data.data;
                        for(let i=0;i<details.length;i++){
                            let detail = {
                                id : details[i]._id,
                                accountId : details[i].accountId,
                                score : details[i].score
                            }
                            this.leaderboardDetails.push(detail);
                        }
                    })
            },
            async getTotalGameweek(){
                axios.get("http://127.0.0.1:9090/gameweek-total")
                    .then(res => {
                        this.totalGameweek = res.data.data;
                    })
            },
            async setGameweek(){
                await this.getMatchesByGameweek();
            }
        },
        async created(){
            await this.getTotalGameweek();
        }
    }
</script>