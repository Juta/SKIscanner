require = require('@std/esm')(module, { esm: 'js', cjs: true })

const { Router } = require('express')
const router = Router()

router.use(require('./api/flights').router)
router.use(require('./api/scores').router)

module.exports = router
