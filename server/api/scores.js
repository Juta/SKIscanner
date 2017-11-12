import { Router } from 'express'
export const router = Router()

import { getScores, addScore } from '../../repo/skyscanner.js'

// Fulfill request to /api/flights
router.get('/scores', function (req, res) {
  getScores()
    .then(scores => {
      reply(res, scores)
    })
})
router.post('/scores/:score/:name', function (req, res) {
  addScore(req.params)
    .then(scores => {
      getScores()
        .then(scores => {
          reply(res, scores)
        })
    })
})
router.get('/scores/:score/:name', function (req, res) {
  addScore(req.params)
    .then(scores => {
      getScores()
        .then(scores => {
          reply(res, scores)
        })
    })
})

function reply (res, data) {
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify(data))
  res.end()
}
