module.exports = validation = {
    STATUS_VALUES: ["activated", "deactivated"],

    isExistent: async (model, criteria = {}, exceptionId = null) => {
        if (typeof model.findOne !== "undefined") {
            try {
                const object = await model.findOne(criteria).lean()
                if (!object) return false

                if (exceptionId && object._id.toString() === exceptionId.toString()) {
                    return false
                }

                return true
            } catch (error) {
                throw new Error(error)
            }
        }

        throw new Error("Can not find object with the model.")
    }
    
}
