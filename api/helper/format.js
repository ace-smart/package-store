

module.exports = {
    toCapitalize: (string = null) => {
        if (!string) throw new Error('{toCapitalize}: Can not invoke with null paramter')

        const rawWords = string.split(" ")
        const capitalizedWords = Array()
        rawWords.forEach(element => {
            element = element.charAt(0).toUpperCase() + element.slice(1,element.length)
            capitalizedWords.push(element)
        })
        
        return capitalizedWords.join(" ")
    }
}