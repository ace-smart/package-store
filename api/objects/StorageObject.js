const StorageModel = require('../models/StorageModel')
const AddressModel = require('../models/AddressModel')
const validator = require('validator')
const {isExistent, hasSpecialChars} = require('../helper/validation')
const STORAGE_STATUS_VALUES = ["available", "full"]
const {toCapitalize} = require('../helper/format')
const ValidationError = require('../errors/validation')
const ObjectError = require('../errors/object')

class StorageObject {
  constructor({_id, name, addressId, propertyType, capacity, description, status, createdAt}) {
    this.id = _id
    this.name = name
    this.addressId = addressId
    this.propertyType = propertyType
    this.capacity = capacity
    this.description = description
    this.status = status
    this.createdAt = createdAt
  }

  static async getOneStorageBy(criteria = {}, selectFields = null) {
    try {
      let storage = await StorageModel.findOne(criteria, selectFields).lean()
      if (storage) {
        storage = new StorageObject({...storage})
        return storage
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getStoragesBy (criteria = {}, selectFields = null) {
    try {
      const storages = await StorageModel.find(criteria, selectFields).lean()
      if (storages.length > 0) {
        let storageList = new Array()
        
        storages.forEach((element) => {
          const object = new StorageObject({ ...element })
          storageList.push(object)
        })

        return storageList 
      }

      return null
    } catch (error) {
      throw error
    }
  }

  async validate(type = 'create', exceptionId = null) {
    let errors = new Array()

    if (type === 'create') {
      if (this.name == null || validator.isEmpty(this.name)) {
        errors.push({
          field: 'name',
          message: "Must be required."
        })
      }
      if (this.addressId == null || validator.isEmpty(this.addressId)) {
        errors.push({
          field: 'addressId',
          message: "Must be required."
        })
      }
      if (this.capacity == null) {
        errors.push({
          field: 'capacity',
          message: "Must be required."
        })
      } else if (this.capacity.size == null || validator.isEmpty(this.capacity.size.toString())) {
          errors.push({
            field: 'capacity.size',
            message: "Must be required."
          })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // name
    if (typeof this.name !== "undefined" && !validator.isEmpty(this.name)) {
      if (hasSpecialChars(this.name)) {
        errors.push({
          field: 'name',
          message: "Must contain only numbers,characters and spaces."
        })
      }
      if (!validator.isLength(this.name, { min: 4, max: 250 })) {
        errors.push({
          field: 'name',
          message: "Must be from 4 to 250 characters."
        })
      }
      if (
          await isExistent(StorageModel, {
              name: this.name,
          }, exceptionId)
      ) {
        errors.push({
          field: 'name',
          message: "Already existent."
        })
      }
    }
    // addressId [required]
    if (typeof this.addressId !== "undefined" && !validator.isEmpty(this.addressId)) {
        if (!validator.isMongoId(this.addressId)) {
          errors.push({
            field: 'addressId',
            message: "Invalid format."
          })
        }
        try {
          if (!(await isExistent(AddressModel, { _id: this.addressId }))) {
            errors.push({
              field: 'addressId',
              message: "Not existent."
            })
          }
        } catch (error) {
          errors.push({
            field: 'addressId',
            message: "Not existent."
          })
        }
    } 
    // propertyType
    if (typeof this.propertyType !== "undefined" && !validator.isEmpty(this.propertyType)) {
        if (!validator.isAlphanumeric(this.propertyType)) {
          errors.push({
            field: 'propertyType',
            message: "Must be numbers and letters."
          })
        }
    }
    // capacity
    if (typeof this.capacity !== "undefined") {
        if (
            JSON.stringify(this.capacity) === "{}" ||
            typeof this.capacity === "string" ||
            this.capacity.size == null ||
            this.capacity.unit == null
        ) {
          errors.push({
            field: 'capacity',
            message: "Must contain two properties {size, unit}."
          })
        }
        if (validator.isEmpty(this.capacity.size.toString())) {
          errors.push({
            field: 'capacity.size',
            message: "Must be required."
          })
        }
        if (!validator.isNumeric(this.capacity.size.toString())) {
          errors.push({
            field: 'capacity.size',
            message: "Must be numbers."
          })
        }
        if (!validator.isAlpha(this.capacity.unit.toString())) {
          errors.push({
            field: 'capacity.unit',
            message: "Must be letters."
          })
        }
        if (!validator.isLength(this.capacity.unit.toString(), { max: 5 })) {
          errors.push({
            field: 'capacity.unit',
            message: "Must be under 5 characters (eg. kg, g)."
          })
        }
    }
    // description
    if (typeof this.description !== "undefined" && !validator.isEmpty(this.description)) {
        if (hasSpecialChars(validator.trim(this.description))) {
          errors.push({
            field: 'description',
            message: "Must not be filled in with special characters."
          })
        }
        if (!validator.isLength(validator.trim(this.description), { max: 350 })) {
          errors.push({
            field: 'description',
            message: "Must be under 350 characters."
          })
        }
    }
    // status
    if (typeof this.status !== "undefined" && !validator.isEmpty(this.status)) {
        if (!validator.isIn(this.status.toLowerCase(), STORAGE_STATUS_VALUES)) {
          errors.push({
            field: 'status',
            message: "Not valid."
          })
        }
    }

    if (errors.length > 0){
      throw new ValidationError(errors)
    }else {
      return this
    }
  }

  clean() {
    let storageObject = this
    const fieldsToClean = ["name", "propertyType", "capacity", "description", "status"]
    for (const [key, value] of Object.entries(storageObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === 'name') {
            storageObject[key] = validator.trim(value.toString())
          }
          if (key === 'description') {
            storageObject[key] = toCapitalize(validator.trim(value.toString()))
          }
          if (key === 'propertyType' || key === 'status') {
            storageObject[key] = validator.trim(value.toString().toLowerCase())
          }
          if (key === 'capacity') {
            if (value.size != null){
              storageObject[key].size = parseFloat(validator.trim(value.size.toString()))
            }
            if (value.unit != null){
              storageObject[key].unit = validator.trim(value.unit.toString().toLowerCase())
            }
          }
        }
        
        if (key === 'updatedAt') {
          storageObject[key] = Date.now()
        }
      }

      if (typeof value === "undefined") {
        delete storageObject[key]
      }
    }
    
    return storageObject
  }

  static async create({...storageData}) {
    try {
      let storageObject = new StorageObject({...storageData})
      storageObject = storageObject.clean()
      const validation = await storageObject.validate('create')
      if (validation) {
        const createdStorage = await StorageModel.create({...validation})
        if (createdStorage){
          const storage = new StorageObject({...createdStorage})
          return storage
        }
      }
      
      throw new Error("Failed to create storage.")
    } catch (error) {
      throw error
    }
  }

  async update (updateData = {}) {
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'StorageObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    if (!(await isExistent(StorageModel, { _id: this.id }))) {
      throw new ObjectError({
        objectName: 'StorageObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    try {
      let updateObject = new StorageObject({ ...updateData })
      updateObject = updateObject.clean()
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        const updated = new StorageObject(
          await StorageModel.findOneAndUpdate({ _id: this.id }, { ...validation }, { new: true })
        )

        return updated
      }

      throw new Error("Failed to update.")
    } catch (error) {
      throw error
    }
  }

  async save() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'StorageObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    try {
      const isSaved = await StorageModel.findOneAndUpdate({_id: this.id}).lean()
      if (isSaved) {
        return new StorageObject({...isSaved})
      }

      throw new Error("Failed to save storage.")
    } catch (error) {
      throw error
    }
  }

  async remove() {
    if (this.id == null) {
      throw new ObjectError({
        objectName: 'StorageObject',
        errorProperty: 'Id',
        message: 'Id is not valid.'
      })
    }

    try {
      const isRemoved = await StorageModel.findOneAndDelete({_id: this.id}).lean()
      if (isRemoved) {
        return new StorageObject({...isRemoved})
      }

      throw new Error("Failed to remove storage.")
    } catch (error) {
      throw error
    }
  }
}

module.exports = StorageObject