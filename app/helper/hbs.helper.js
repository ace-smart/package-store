const { cpuUsage } = require("process")
const { options } = require("../routes/client/product.route")
const { makePagination } = require("./helper")

module.exports = {
  ifeq: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  formatDate: function (date) {
    if (date == "") {
      date = new Date()
    }

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  },
  formatShortDate: function (date) {
    return new Date(date)
      .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
      .replace("-", "/")
  },
  ifMatch: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
  },
  showNumOfItems: function (numOfItems, itemPerPage, currentPage) {
    let currentNumOfItems = itemPerPage * currentPage

    if (currentNumOfItems > numOfItems) {
      currentNumOfItems = numOfItems
    }

    return currentNumOfItems
  },
  equal: function (a, b, options) {
    if (a != null && b != null) {
      a = parseInt(a.toString())
      b = parseInt(b.toString())
      if (a === b) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    } else {
      return null
    }
  },
  parseToString: function (a = "") {
    return JSON.stringify(a)
  },
  increaseIndex: function (index) {
    index = parseInt(index)
    return index + 1
  },
  formatPrice: function (price) {
    if (price != null) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        parseFloat(price)
      )
    } else {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        parseFloat(0)
      )
    }
  },
  formatNumber: function (number) {
    if (number != null) {
      return new Intl.NumberFormat("en-US").format(parseInt(number))
    } else {
      return 0
    }
  },
  formatFloatNumber: function (number) {
    if (number != null) {
      return new Intl.NumberFormat("en-US").format(parseFloat(number))
    } else {
      return 0
    }
  },
  parseImageToString(imageBuffer = null) {
    return imageBuffer.toString("base64")
  },
  print64baseProductImg(fileName, extension) {
    const path = `tmp\\productImg\\${fileName}.${extension}`
    const fs = require("fs")
    return fs.readFileSync(path).toString("base64")
  },
  print64baseAvatar(fileName, extension) {
    const path = `tmp\\avatar\\${fileName}.${extension}`
    const fs = require("fs")
    return fs.readFileSync(path).toString("base64")
  },
  lessThan(a, b, options) {
    if (a != null && b != null) {
      a = parseFloat(a.toString())
      b = parseFloat(b.toString())
      if (a < b) {
        return options.fn(this)
      }
      return options.inverse(this)
    } else {
      return null
    }
  },
  greaterThan(a, b, options) {
    if (a != null && b != null) {
      a = parseFloat(a.toString())
      b = parseFloat(b.toString())
      if (a > b) {
        return options.fn(this)
      }
      return options.inverse(this)
    } else {
      return null
    }
  },
  formatPercentage(percentage = 0) {
    return parseFloat(percentage).toFixed(2)
  },
  multiply(number = 1, multiplier = 1) {
    number = parseInt(number)
    multiplier = parseInt(multiplier)
    return number * multiplier
  },
  makePagination(pagination, options) {
    const {numOfPages, currentPage} = pagination
    const pages = []
    for (let i = 1; i <= numOfPages; i++) {
        pages.push(i)
    }
    
    return options.fn({pages: pages, currentPage: currentPage})
  },
}
