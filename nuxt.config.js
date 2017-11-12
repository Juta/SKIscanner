require('dotenv').config()

module.exports = {
  env: {
    SKYSCANNER_SECRET: process.env.SKYSCANNER_SECRET
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1' },
      { name: 'theme-color', content: '#2E0088' },
    ],
  },
  plugins: [
    '@/global.js'
  ],
  serverMiddleware: [
    { path: '/api', handler: '~server/api.js' }
  ]
}
