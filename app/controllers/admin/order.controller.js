const axiosInstance = require("../../helper/axios.helper")
const { handleErrors, getFilledFields, getValidFields } = require("../../helper/helper")
const helper = require("../../helper/helper")
const getSubcategories = async function (accessToken) {
    try {
        // Get subcategories
        const subcateResponse = await axiosInstance.get(`/admin/subcategories`, {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        })
        if (subcateResponse.status === 200) {
            return subcateResponse.data
        }
    } catch (error) {
        throw error
    }
}
const getVouchers = async function (accessToken) {
    try {
        // Get vouchers
        const voucherResponse = await axiosInstance.get(`/admin/vouchers`, {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        })
        if (voucherResponse.status === 200) {
            return voucherResponse.data
        }
    } catch (error) {
        throw error
    }
}
const getOrderById = async function (accessToken, orderId) {
    try {
        const response = await axiosInstance.get(`/admin/orders/${orderId}`, {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        })

        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw error
    }
}
const getOrderData = function (reqBody) {
    reqBody = JSON.parse(JSON.stringify(reqBody))
    return {
        totalCost: helper.formatPriceValue(reqBody.totalCost),
        shippingFee: helper.formatPriceValue(reqBody.shippingFee),
        voucherId: reqBody.voucherCode,
        finalCost: helper.formatPriceValue(reqBody.finalCost),
        paymentMethod: reqBody.paymentMethod,
        deliveryDay: helper.toDateFormat(reqBody.deliveryDay),
        orderDetails: JSON.parse(reqBody.orderDetails),
    }
}
const setStage = function (currentStage = "processing", toStage = "next") {
    const stages = ["processing", "packing", "delivering", "done"]
    let resultStage = "processing"

    if (toStage === "next") {
        stages.forEach((value, index, thisArr) => {
            if (value === currentStage) {
                if (index < thisArr.length - 1) {
                    resultStage = thisArr[index + 1]
                } else {
                    resultStage = currentStage
                }
            }
        })
    } else if (toStage === "previous") {
        stages.forEach((value, index, thisArr) => {
            if (value === currentStage) {
                if (index > 0) {
                    resultStage = thisArr[index - 1]
                } else {
                    resultStage = currentStage
                }
            }
        })
    } else if (toStage === "final") {
        if (currentStage === "done") {
            resultStage = "canceled"
        } else if (currentStage === "canceled") {
            resultStage = "done"
        }
    }

    return resultStage
}

module.exports = {
    // @desc:   Show orders
    // @route   GET /orders
    showOrderList: async (req, res) => {
        try {
            const response = await axiosInstance.get(`/admin/orders`, {
                headers: {
                    Authorization: "Bearer " + req.user.accessToken,
                },
            })

            if (response.status === 200) {
                return res.render("templates/admin/order/order.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "list",
                    header: "List of orders",
                    route: "orders",
                    orders: response.data,
                    user: await helper.getUserInstance(req),
                    csrfToken: req.csrfToken(),
                })
            }
        } catch (error) {
            return helper.handleErrors(res, error, "admin")
        }
    },

    // @desc:   Get orders by Id
    // @route   GET /orders/:id
    viewOrderById: async (req, res) => {
        try {
            const order = await getOrderById(req.user.accessToken, req.params.id)
            if (order) {
                return res.render("templates/admin/order/order.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "view",
                    header: "Order in detail",
                    route: "orders",
                    csrfToken: req.csrfToken(),
                    user: await helper.getUserInstance(req),
                    subcategories: await getSubcategories(req.user.accessToken),
                    vouchers: await getVouchers(req.user.accessToken),
                    order: order
                })
            }
        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
        }
    },

    // @desc    show create order form
    // @route   GET /orders/add
    showCreateOrderForm: async (req, res) => {
        try {
            return res.render("templates/admin/order/order.hbs", {
                layout: "admin/main.layout.hbs",
                content: "form",
                formType: "create",
                header: "Add a new order",
                route: "orders",
                csrfToken: req.csrfToken(),
                user: await helper.getUserInstance(req),
                subcategories: await getSubcategories(req.user.accessToken),
                vouchers: await getVouchers(req.user.accessToken),
            })
        } catch (error) {
            return helper.handleErrors(res, error, "admin")
        }
    },

    // @desc    create order form
    // @route   POST /orders/add
    createOrder: async (req, res) => {
        const orderData = getOrderData(req.body)
        try {
            const response = await axiosInstance.post(`/admin/orders`, orderData, {
                headers: {
                    Authorization: "Bearer " + req.user.accessToken,
                },
            })

            if (response.status === 201) {
                req.flash("success", "You have created a new order.")
                return res.render("templates/admin/order/order.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "create",
                    header: "Add a new order",
                    route: "orders",
                    csrfToken: req.csrfToken(),
                    user: await helper.getUserInstance(req),
                    subcategories: await getSubcategories(req.user.accessToken),
                    vouchers: await getVouchers(req.user.accessToken),
                })
            }
        } catch (error) {
            if (error.response.status === 400) {
                const errors = error.response.data.error.invalidation
                const validData = helper.getValidFields(errors, orderData)
                
                req.flash("fail", "Your input is not valid. Please check and then fill in again.")
                return res.render("templates/admin/order/order.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "create",
                    header: "Add a new order",
                    route: "orders",
                    csrfToken: req.csrfToken(),
                    user: await helper.getUserInstance(req),
                    subcategories: await getSubcategories(req.user.accessToken),
                    vouchers: await getVouchers(req.user.accessToken),
                    errors: helper.handleInvalidationErrors(errors),
                    validData: validData,
                })
            }
        }

        return helper.handleErrors(res, error, "admin")
    },

    // @desc    show update order form
    // @route   GET /orders/add
    showUpdateOrderForm: async (req, res) => {
        try {
            const order = await getOrderById(req.user.accessToken, req.params.id)
            if (order) {
                return res.render("templates/admin/order/order.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "update",
                    header: "Order in detail",
                    route: "orders",
                    csrfToken: req.csrfToken(),
                    user: await helper.getUserInstance(req),
                    subcategories: await getSubcategories(req.user.accessToken),
                    vouchers: await getVouchers(req.user.accessToken),
                    order: order
                })
            }
        } catch (error) {
            return helper.handleErrors(res, error, 'admin')
        }
    },

    // @desc    Update order
    // @route   PUT /orders/:id
    updateOrderById: async (req, res) => {
        let orderData = getOrderData(req.body)
        try {
            const order = await getOrderById(req.user.accessToken, req.params.id)
            if (order) {
                orderData = getFilledFields(orderData, order)
            }
            
            const response = await axiosInstance.put(`/admin/orders/${req.params.id}`, orderData, {
                headers: {
                    Authorization: "Bearer " + req.user.accessToken,
                },
            })

            if (response.status === 204) {
                req.flash("success", "Your changes were completely saved.")
                return res.render("templates/admin/order/order.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "update",
                    header: "Update order",
                    route: "orders",
                    csrfToken: req.csrfToken(),
                    user: await helper.getUserInstance(req),
                    subcategories: await getSubcategories(req.user.accessToken),
                    vouchers: await getVouchers(req.user.accessToken),
                    order:  await getOrderById(req.user.accessToken, req.params.id)
                })
            }
        } catch (error) {
            if (error.response.status == 400) {
                const errors = error.response.data.error.invalidation
                const validData = getValidFields(errors, orderData)
                
                req.flash("fail", "Your input is not valid. Please check and then fill in again.")
                return res.render("templates/admin/order/order.hbs", {
                    layout: "admin/main.layout.hbs",
                    content: "form",
                    formType: "update",
                    header: "Update order",
                    route: "orders",
                    csrfToken: req.csrfToken(),
                    user: await helper.getUserInstance(req),
                    subcategories: await getSubcategories(req.user.accessToken),
                    vouchers: await getVouchers(req.user.accessToken),
                    errors: helper.handleInvalidationErrors(errors),
                    validData: validData,
                })
            }
            return helper.handleErrors(res, error, "admin")
        }
    },

    // @desc    Update order;s status
    // @route   PUT /orders/next-stage?stage='processing'&id='123eee'
    nextStage: async (req, res) => {
        try {
            const stageData = setStage(req.query.stage, "next")
            const response = await axiosInstance.put(
                `/admin/orders/${req.query.id}`,
                {
                    status: stageData,
                },
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                }
            )

            if (response.status === 204) {
                return res.sendStatus(200)
            }
        } catch (error) {
            return handleErrors(res, error, "admin")
        }
    },

    // @desc    Update order's status
    // @route   PUT /orders/previous-stage?stage='processing'&id='123eee'
    previousStage: async (req, res) => {
        try {
            const stageData = setStage(req.query.stage, "previous")
            const response = await axiosInstance.put(
                `/admin/orders/${req.query.id}`,
                {
                    status: stageData,
                },
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                }
            )

            if (response.status === 204) {
                return res.sendStatus(200)
            }
        } catch (error) {
            return handleErrors(res, error, "admin")
        }
    },

    // @desc    Update order's status
    // @route   PUT /orders/previous-stage?stage='processing'&id='123eee'
    finalStage: async (req, res) => {
        try {
            const stageData = setStage(req.query.stage, "final")
            const response = await axiosInstance.put(
                `/admin/orders/${req.query.id}`,
                {
                    status: stageData,
                },
                {
                    headers: {
                        Authorization: "Bearer " + req.user.accessToken,
                    },
                }
            )

            if (response.status === 204) {
                return res.sendStatus(200)
            }
        } catch (error) {
            return handleErrors(res, error, "admin")
        }
    },

    // @desc    Delete order
    // @route   DELETE /orders/:id
    removeOrderById: async (req, res) => {
        try {
            const response = await axiosInstance.delete(`/admin/orders/${req.params.id}`, {
                headers: {
                    Authorization: "Bearer " + req.user.accessToken,
                },
            })

            if (response.status === 204) {
                return res.sendStatus(200)
            }
        } catch (error) {
            return helper.handleErrors(res, error, "admin")
        }
    },
}
