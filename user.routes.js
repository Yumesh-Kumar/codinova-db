const { Router } = require("express")
const router =  Router()
const exchangeController = require("./exchange.controller")


router.get("/exchange-list", exchangeController.getExchangeList )
router.get("/exchange-sync", exchangeController.syncExchangeListToDB )

module.exports = router