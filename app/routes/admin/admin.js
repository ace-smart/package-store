const router = require("express").Router()
const {
  _checkAuthenticatedAdmin,
  _loginWithCookie,
  _autoRenewAccessToken,
} = require("../../helper/auth.helper")
const authRouter = require("./auth.route")
const indexRouter = require("./index.route")
const profileRouter = require("./profile.route")
const accountRouter = require("./account.route")
const categoryRouter = require("./category.route")
const productRouter = require("./product.route")
const providerRouter = require("./provider.route")
const orderRouter = require("./order.route")
const voucherRouter = require("./voucher.route")
const contactRouter = require("./contact.route")
const restockRouter = require("./restock.route")
const storageRouter = require("./storage.route")

router.use(_autoRenewAccessToken)
router.use(_loginWithCookie)
router.use(authRouter)
router.use(_checkAuthenticatedAdmin, indexRouter)
router.use(_checkAuthenticatedAdmin, profileRouter)
router.use("/accounts", _checkAuthenticatedAdmin, accountRouter)
router.use("/categories", _checkAuthenticatedAdmin, categoryRouter)
router.use("/products", _checkAuthenticatedAdmin, productRouter)
router.use("/providers", _checkAuthenticatedAdmin, providerRouter)
router.use("/storages", _checkAuthenticatedAdmin, storageRouter)
router.use("/orders", _checkAuthenticatedAdmin, orderRouter)
router.use("/vouchers", _checkAuthenticatedAdmin, voucherRouter)
router.use("/contacts", _checkAuthenticatedAdmin, contactRouter)
router.use("/restocks", _checkAuthenticatedAdmin, restockRouter)

module.exports = router
