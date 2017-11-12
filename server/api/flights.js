import { Router } from 'express'
export const router = Router()

const maxFlights = 50

import { getFlights } from '../../repo/skyscanner.js'

// Fulfill request to /api/flights
router.get('/flights/:origin', function (req, res) {
  const origin = req.params.origin
  
  let airportIds = require('../../airports.js')
    .map(airport => airport.Id)
    .filter(destination => destination != origin)
  
  airportIds = shuffleArray(airportIds).slice(0, maxFlights)
  
  Promise.all(airportIds.map(dest => getFlights(origin, dest)))
    .then(flights => {
      reply(res, [].concat.apply([], flights))
      //res.json([].concat(flights))
    })
    .catch(error => {
      console.log(error.message);
      res.json({ error: true })
    })

  //'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/BE/eur/en-US/gva/ams/2017-12/?apikey='
  
  // get x 
})

 function reply (res, data) {
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify(data))
  res.end()
}

  // Stackoverflow shuffle
function shuffleArray (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
