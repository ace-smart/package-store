const StorageModel = require('../models/StorageModel')
const AddressModel = require('../models/AddressModel')
const validator = require('validator')
const AddressObject = require('./AddressObject')
const {isExistent, hasSpecialChars} = require('../helper/validation')
const STORAGE_STATUS_VALUES = ["available", "full"]
const PROPERTY_TYPE_VALUES = ["rental", "owned"]
const ValidationError = require('../errors/validation')
const ObjectError = require('../errors/object')

class StorageObject {
  constructor({_id, name, addressId, propertyType, capacity, status, createdAt}) {
    this.id = _id
    this.name = name
    this.addressId = addressId
    this.propertyType = propertyType
    this.capacity = capacity
    this.status = status
    this.createdAt = createdAt
  }

  async setAddress() {
    if(this.addressId instanceof Object) {
      // populated
      this.address = new AddressObject({...this.addressId})
      this.addressId = this.address.id.toString()
    } else if (typeof this.addressId === 'string') {
      // create - update
      this.address = await AddressObject.getOneAddressById(this.addressId)
    } else {
      this.address = null
    }
  }

  static async getOneStorageBy(criteria = {}, selectFields = null) {
    try {
      const storageDoc = await StorageModel.findOne(criteria, selectFields).populate({
        path: 'addressId'
      }).lean()

      if (storageDoc) {
        const storage = new StorageObject({...storageDoc})
        await storage.setAddress()
        return storage
      }

      return null
    } catch (error) {
      throw error
    }
  }

  static async getStoragesBy (criteria = {}, selectFields = null) {
    try {
      const storageDocs = await StorageModel.find(criteria, selectFields).lean()

      if (storageDocs.length > 0) {
        let storageList = new Array()
        
        storageDocs.forEach(async (element) => {
          const object = new StorageObject({...element})
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
      if (this.name == null || validator.isEmpty(this.name.toString())) {
        errors.push({
          field: 'name',
          message: "Must be required."
        })
      }
      if (this.capacity == null || validator.isEmpty(this.capacity.toString())) {
        errors.push({
          field: 'capacity',
          message: "Must be required."
        })
      }

      if (errors.length > 0) {
        throw new ValidationError(errors)
      }
    }

    // name
    if (this.name != null && !validator.isEmpty(this.name.toString())) {
      if (hasSpecialChars(this.name)) {
        errors.push({
          field: 'name',
          message: "Must contain only numbers,characters and spaces.",
          value: this.name
        })
      }
      if (!validator.isLength(this.name.toString(), { min: 4, max: 250 })) {
        errors.push({
          field: 'name',
          message: "Must be from 4 to 250 characters.",
          value: this.name
        })
      }
      if (
          await isExistent(StorageModel, {
              name: this.name,
          }, exceptionId)
      ) {
        errors.push({
          field: 'name',
          message: "Already existent.",
          value: this.name
        })
      }
    }
    // addressId
    if (this.addressId != null && !validator.isEmpty(this.addressId.toString())) {
        if (!validator.isMongoId(this.addressId)) {
          errors.push({
            field: 'addressId',
            message: "Invalid format.",
            value: this.addressId
          })
        }
        if (!(await isExistent(AddressModel, { _id: this.addressId }))) {
          errors.push({
            field: 'addressId',
            message: "Not existent.",
            value: this.addressId
          })
        }
    } 
    // propertyType
    if (this.propertyType != null && !validator.isEmpty(this.propertyType.toString())) {
        if (!validator.isAlphanumeric(this.propertyType)) {
          errors.push({
            field: 'propertyType',
            message: "Must be numbers and letters.",
            value: this.propertyType
          })
        }
        if (!validator.isIn(this.propertyType.toLowerCase(), PROPERTY_TYPE_VALUES)) {
          errors.push({
            field: 'propertyType',
            message: "Value is not valid.",
            value: this.propertyType
          })
        }
    }
    // capacity
    if (this.capacity != null && !validator.isEmpty(this.capacity.toString())) {
      if (!validator.isNumeric(this.capacity.toString())) {
        errors.push({
          field: 'capacity',
          message: "Must be numbers.",
          value: this.capacity
        })
      }
      if (parseFloat(this.capacity.toString()) < 0) {
        errors.push({
          field: 'capacity',
          message: "Can not be negative.",
          value: this.capacity
        })
      }
    }
    // status
    if (this.status != null && !validator.isEmpty(this.status.toString())) {
        if (!validator.isIn(this.status.toLowerCase(), STORAGE_STATUS_VALUES)) {
          errors.push({
            field: 'status',
            message: "Value is not valid.",
            value: this.status
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
    const fieldsToClean = ["name", "propertyType", "capacity", "status"]
    for (const [key, value] of Object.entries(storageObject)) {
      if (value != null) {
        const isFound = fieldsToClean.find((field) => key === field)
        if (isFound) {
          if (key === 'name') {
            storageObject[key] = validator.trim(value.toString())
          }
          if (key === 'propertyType' || key === 'status') {
            storageObject[key] = validator.trim(value.toString().toLowerCase())
          }
          if (key === 'capacity') {
              storageObject[key] = parseFloat(validator.trim(value.toString()))
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
      // Add address
      if(storageData.address) {
        if (!AddressObject.hasEmptyAddressData(storageData.address)) {
          const createdAddress = await AddressObject.create({...storageData.address})
          storageData.addressId = createdAddress.id.toString()
        } else {
          delete storageData.address
        }
      }
      
      let storageObject = new StorageObject({...storageData})
      const validation = await storageObject.validate('create')
      if (validation) {
        storageObject = storageObject.clean()
        const createdStorage = await StorageModel.create({...storageObject})
        if (createdStorage){
          return new StorageObject({...createdStorage._doc})
        }
      }
      
      throw new Error("Failed to create storage.")
    } catch (error) {
      throw error
    }
  }

  async update ({...updateData}) {
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
      // Update address
      if (updateData.address) {
        if (!AddressObject.hasEmptyAddressData(updateData.address)) {
          if (updateData.address.id == null) {
            // Create 
            const createdAddress = await AddressObject.create({...updateData.address})
            updateData.addressId = createdAddress.id.toString()
          } else{
            // Update
            const addressObj = await AddressObject.getOneAddressById(updateData.address.id)
            await addressObj.update({...updateData.address})
          }
        } else{
          delete updateData.address
        }
      }
      
      let updateObject = new StorageObject({ ...updateData })
      const validation = await updateObject.validate("update", this.id)
      if (validation) {
        updateObject = updateObject.clean()
        const updated = await StorageModel.findOneAndUpdate(
          { _id: this.id }, { ...updateObject }, { new: true })

        return new StorageObject(updated)
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