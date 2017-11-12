<template>
	<div>
    <div class="hud">
      <h2>{{ saldo }}</h2>
      <h1><img src="https://cdn.glitch.com/74ccbca4-c773-4c58-936b-bea9a092914a%2Fski-jumping-svgrepo-com.svg?1510424854468"><b>ski</b><small>scanner</small></h1>
      <div>
        <button type="button" @click="reset">Reset</button>
      </div>
      <div>
        {{ Math.floor(date) }} december @ {{place}}
      </div>
      <div v-for="g in games">
        #{{g.placeId}} ${{g.earned}}
      </div>
    </div>
    <transition name="modal" v-if="isGameOver">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <h1>Game over</h1>
            </div>

            <div class="modal-body">
              <p>Score: {{ saldo }}</p>
              <table>
                <tbody>
                  <tr v-for="score in scores">
                    <td style="padding-right:1em">{{score.score}}</td>
                    <td v-if="score.name">{{score.name}}</td>
                    <td v-else>
                      <input type="text" v-model="scoreName">
                      <button type="submit" @click="postScore">Submit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="map" v-else>
      <!-- Your location -->
      <place :id="place" :orientation="orientation" />
      
      <!-- Your options -->
      <flight v-for="flight in soonFlights"
              :flight="flight"
              :origin="flight.origin"
              :dest="flight.destination"
              @take="take(flight)"
              :key="flight.id"
              :game="soonGames.find(g => g.placeId === flight.destination)"
              />
      <game v-for="game in soonGames"
            :game="game"
            :key="'soon' + game.id"
            />
    </div>

	</div>
</template>

<script>
  import axios from 'axios'

  import Game from '~/components/Game'
  import Place from '~/components/Place'
  import Flight from '~/components/Flight'
  import { getAngle } from '~/components/util'
  
  const REALTIME = 100

  export default {
    data () {
      return {
        date: 1,
        games: [],
        flying: 0,
        spent: 0,
        gameOver: false,
        timeLeft: 0,
        place: 'EDI',
        orientation: 0,
        places: require('../airports.js'),
        flights: [],
        scores: [],
        scoreName: '',
      } 
    },
    computed: {
      earned () {
        return 500 + this.games.reduce((count, g) => count + (g.earned || 0), 0)
      },
      saldo () {
        return this.earned - this.spent
      },
      soonFlights () {
        return this.flights.filter(f => f.origin === this.place  && f.date >= this.date && f.date <= this.date + 3)
      },
      soonGames () {
        return this.games.filter(g => g.date >= this.date && g.date < this.date + g.duration && !g.earned)
      },
      isGameOver () {
        return (this.date >= 31 && !this.flights.length) || this.gameOver
      },
      // games() {
      //   var distribution = [1,1,1,2,2,3]
      //   var rewards = [[100,200],[200,300],[400,500]]
      //   var r = Math.floor(Math.random() * distribution.length)
      //   return this.soonFlights.map(f => ({
      //     placeId: f.destination,
      //     size: distribution[r],
      //     rewards: rewards[distribution[r] - 1]
      //   }))
      // }
    },
    methods: {
      take (flight) {
        if (!flight) return alert('Choose a flight')
        if (flight.origin !== this.place) return alert('You are not at this airport')
        if (flight.destination === this.place) return alert('You are already at this destination')
        //if (flight.date < this.date) return alert('Missed your flight')
        if (flight.date < this.date) flight.date = this.date
        
        const flyDays = 1
        
        // Book the ticket
        this.spent += flight.price
        
        // Change direction plane
        const place1 = this.places.find(p => p.Id === this.place) || {}    
        const place2 = this.places.find(p => p.Id === flight.destination) || {}
        this.orientation = getAngle(place1.lat, place1.lng, place2.lat, place2.lng)
        
        // Board the flight
        setTimeout(() => {
          this.flying++
          this.place = flight.destination
          // this.date = flight.date + flyDays
          if (this.date < 2) {
            this.date = 2
          }

          // Load next destinations
          Promise.all([
            this.getFlights(false),
            waitForMS(flyDays * REALTIME)
          ]).then(([flights]) => {
            this.flights = flights
            this.playGames()
          })
          
          // Start flying
          setTimeout(() => {
            this.flying--
          }, flyDays * REALTIME)
        }, 0)
        //}, (flight.date - this.date) * REALTIME)
      },
      reset () {
        this.stopGame(false)
        this.placeId = 'EDI'
        this.date = 1
        this.getFlights(true)
        this.generateGames()
      },
      stopGame (over) {
        clearInterval(this.interval)
        this.interval = 0
        this.flights = []
        this.gameOver = over
        axios.get('/api/scores')
          .then(({ data }) => {
            data.push({
              name: '',
              score: this.saldo
            })
            data.sort((a, b) => b.score < a.score)
            this.scores = data
          })
      },
      postScore (apply) {
        axios.post('/api/scores/' + this.saldo + '/' + this.scoreName)
          .then(({ data }) => {
            data.push({
              name: '',
              score: this.saldo
            })
            data.sort((a, b) => b.score < a.score)
            this.scores = data
          })
      },
      getFlights (apply) {
        return axios.get('/api/flights/' + this.place)
          .then(({ data }) => {
            data.reverse()
            data.forEach((flight, id) => {
              flight.id = id
            })
            if (apply) {
              this.flights = data
            }
            return data
          })
      },
      // Check if game is being played
      playGames () {
        const playing = this.games
          .filter(g => g.placeId === this.place && g.date >= this.date && g.date < this.date + g.duration)
        
        playing.forEach(g => {
          if (!g.earned) {
            g.medal = 1 + Math.floor(Math.random() * 3)
            g.earned = Math.floor(1 + Math.random() * g.size * (g.medal + 1)) * 50
          }
        })
      },
      // Generate list of games
      generateGames () {
        this.games = emptyArray(20)
          .map(id => ({
            id,
            earned: 0,
            medal: 0,
            placeId: getRandomElement(this.places).Id,
            date: Math.floor(Math.random() * 31),
            duration: 3,
            size: getRandomElement([1,1,1,2,2,3])
          }))
          .filter(g => g.placeId !== this.place || !(g.date >= this.date && g.date < this.date + g.duration))
      }
    },
    mounted () {
      this.reset()
    },
    watch: {
      date (val, old) {
        if (old === 1 && !this.interval) {
          this.interval = setInterval(() => {
            this.date++
          }, 1 * REALTIME)
        }
 
        // this.getFlights()
        this.playGames()

        if (val >= 31) {
          return this.stopGame(true)
        }
      }
    },
    head: {
      title: 'SKIscanner'
    },
    components: {
      Game,
      Flight,
      Place
    }
}

function emptyArray(n) {
  var arr = Array.apply(null, Array(n));
  return arr.map(function (x, i) { return i });
}
function getRandomElement(items) {
  return items[Math.floor(Math.random() * items.length)]
}
function waitForMS (ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
</script>

<style>
  .hud {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 1em;
    font-size: 14px;
  }
  .hud button {
    pointer-events: all;
  }
  .hud h2 {
    margin: 1rem 0 0;
    font-size: 3em;
  }
  .hud h1 {
    position: fixed;
    right: 1rem;
    top: 1rem;
    font-size: 2em;
    font-style: italic;
    margin: 0;
  }
  .hud h1 small {
    font-size: 1em;
    font-weight: 500;
  }
  .hud h1 b {
    font-weight: 900;
  }
  .modal-mask h1 {
    font-size: 1.5em;
    margin: 0;
  }
  .map {
    overflow: hidden;
    position: relative;
    width: 20em;
    height: 20em;
    background-image: url(https://cdn.glitch.com/74ccbca4-c773-4c58-936b-bea9a092914a%2Feurope-square.png?1510420465233);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
  pointer-events: all;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: transform .5s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}


.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: scale(.1);
}
</style>
