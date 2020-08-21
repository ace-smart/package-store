module.exports = {
    DEFAULT_VALUES: {
        user: { role: "user", status: "deactivated" },
        status: "deactivated",
        order: {status: 'processing'}
    },
    STATUS_VALUES: ["activated", "deactivated"],
    USER_ROLE: ["user", "admin"],
    USER_FIELDS: ["username", "password", "email", "status", "role"],
    PROFILE_FIELDS: ["firstName", "lastName", "gender", "dateOfBirth", "phoneNumber", "status"],
    PROFILE_GENDER_VALUES: ["male", "female", "lgbt"],
    CATEGORY_FIELDS: ["name", "status", "subcategories"],
    ADDRESS_FIELDS: ["street", "district", "city", "country", "postalCode", "status"],
    PRODUCT_FIELDS: ["categoryId", "name", "details", "price", "status"],
    PROVIDER_FIELDS: ["name", "addressId", "email", "description", "country", "status"],
    ORDER_FIELDS: ["totalCost","shippingFee","finalCost","paymentMethod","userId","voucherCode","currency","status"],
    ORDER_STATUS_VALUES: ["processing","received","racking","delivering","done","refunded","canceled"],
    VOUCHER_FIELDS: ["name","description","code","rate","minValue","maxValue","usageLimit","validUntil","status"],
    VOUCHER_LIMIT_TYPE: ["daily","weekly","seasonal","unlimited","personal","manually"],
    STORAGE_FIELDS: ["name","addressId","propertyType","capacity","description","status"],STORAGE_STATUS_VALUES: ["available","full"]
}