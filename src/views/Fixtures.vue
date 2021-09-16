<template>
    <div class="box">
        <select v-model="gameweek" @change="setGameweek">
            <option value="">Choose Gameweek</option>
            <option v-for="gameweek in totalGameweek" :key="gameweek" :value="gameweek"> Gameweek {{gameweek}} </option>
        </select>
    </div>
    <div>
        <li v-for="(match) in matches" :key="match.match_id">
            <h3> <img :src="`${match.home_team}`" style="width:100px;height:100px"> {{match.home_score}} - {{match.away_score}} <img :src="`${match.away_team}`" style="width:100px;height:100px"> </h3>
            <button @click="getDetailMatch(match.match_id)">Detail</button>
        </li>
    </div>
    <div>
        <table class="tg">
            <thead>
            <tr>
                <th class="tg-0lax">Player</th>
                <th class="tg-0lax">Goal</th>
                <th class="tg-0lax">Assist</th>
                <th class="tg-0lax">Yellow Card</th>
                <th class="tg-0lax">Red Card</th>
                <th class="tg-0lax">Own Goal</th>
                <th class="tg-0lax">Total Point</th>
            </tr>
            </thead>
            <tbody v-for="(detail) in matchDetails" :key="detail.id">
            <tr>
                <td class="tg-0lax">{{detail.player_nm}}</td>
                <td class="tg-0lax">{{detail.goal }}</td>
                <td class="tg-0lax">{{detail.assist }}</td>
                <td class="tg-0lax">{{detail.yellow_card }}</td>
                <td class="tg-0lax">{{detail.red_card }}</td>
                <td class="tg-0lax">{{detail.own_goal }}</td>
                <td class="tg-0lax">{{detail.total_point }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0lax{text-align:left;vertical-align:top}

.box {
  top: 50%;
  left: 50%;
}

.box select {
  background-color: #0563af;
  color: white;
  padding: 12px;
  width: 250px;
  border: none;
  font-size: 20px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  -webkit-appearance: button;
  appearance: button;
  outline: none;
}

.box::before {
  content: "\f13a";
  font-family: FontAwesome;
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 100%;
  text-align: center;
  font-size: 28px;
  line-height: 45px;
  color: rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.box:hover::before {
  color: rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.2);
}

.box select option {
  padding: 30px;
}

</style>
<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                gameweek : "",
                matches : [],
                matchDetails : [],
                totalGameweek : 0,
            }
        },
        methods: {
            async getMatchesByGameweek(){
                this.matches = [];
                this.matchDetails = [];
                axios.get("http://127.0.0.1:9090/gameweek/"+this.gameweek)
                  .then(res => {
                    console.log(res.data.data);
                    let fixtures = res.data.data;
                    for(let i=0;i<fixtures.length;i++){
                        let match = {
                            match_id : fixtures[i].match_id,
                            home_team : fixtures[i].hometeam[0].teamImg,
                            away_team : fixtures[i].awayteam[0].teamImg,
                            home_score : fixtures[i].home_score,
                            away_score : fixtures[i].away_score,
                        };
                        this.matches.push(match);
                    }
                  })
            },
            async getDetailMatch(match_id){
                this.matchDetails = [];
                axios.get("http://127.0.0.1:9090/fixture/detail/"+match_id)
                    .then(res => {
                        let details =res.data.data;
                        for(let i=0;i<details.length;i++){
                            let detail = {
                                id : details[i]._id,
                                player_id : details[i].player_id,
                                player_nm : details[i].player[0].playerNm,
                                is_playing : details[i].is_playing,
                                goal : details[i].goal,
                                assist : details[i].assist,
                                yellow_card : details[i].yellow_card,
                                red_card : details[i].red_card,
                                own_goal : details[i].own_goal,
                                total_point : details[i].total_point,
                            }
                            this.matchDetails.push(detail);
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