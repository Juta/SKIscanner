import axios from 'axios'
import db from 'sqlite';

const startMonth = '2017-12'
const apiKey = process.env.SKYSCANNER_SECRET
console.log(__dirname + '/migrations')
const init = Promise.resolve()
  .then(() => db.open('./skyscanner.sqlite'))
  .then(() => db.migrate({ force: 'last', migrationsPath: __dirname + '/migrations' }))
  .then(() => console.log('migrated!'))
  .catch(err => console.error(err.stack))

export function getFlights (origin, destination) {
  const key = origin + '-' + destination
  return db.get('SELECT * FROM flights WHERE key = ?', key)
    .then(row => {
      if (!row) {
        return Promise.reject()
      }
      console.log('success', key, row.value.length)
      return JSON.parse(row.value)
    })
    .catch(() => getFreshFlights(origin, destination))
}

export function getScores () {
  return db.all('SELECT * FROM scores LIMIT 50')
}

export function addScore ({ name, score }) {
  return db.run(
      'INSERT INTO scores (name, score) VALUES (?, ?)',
      name,
      score
    ).then(() => {
    })
}
function saveFlights (key, value) {
  console.log(JSON.stringify(value).length)
  return db.run(
    'INSERT INTO flights (key, value) VALUES (?, ?)',
    key,
    JSON.stringify(value)
  ).then(() => {
    console.log(key, 'inserted')
  })
}


function getFreshFlights (origin, destination) {
  const key = origin + '-' + destination
  console.log('fresh fromto', origin, destination)
  return axios.get('http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/BE/eur/en-US/'
                  + origin + '/'
                  + destination + '/'
                  + startMonth + '/'
                  +'?apikey='+apiKey)
    .then(response => {
      return response.data.Quotes
        .map(({ MinPrice, OutboundLeg: { DepartureDate } }) => ({
          origin,
          destination,
          date: toGameDate(DepartureDate),
          price: MinPrice,
        }))
    })
    .then(flights => {
      setTimeout(() => saveFlights(key, flights), 100)
      return flights
    })
}

function toGameDate (dateString) {
  return parseInt(dateString.slice(8, 10))
}

function saveFlights (key, value) {
  console.log(JSON.stringify(value).length)
  return db.run(
    'INSERT INTO flights (key, value) VALUES (?, ?)',
    key,
    JSON.stringify(value)
  ).then(() => {
    console.log(key, 'inserted')
  })
}
