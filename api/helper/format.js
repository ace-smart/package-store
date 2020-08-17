

module.exports = {
    toCapitalize: (string = null, applyToEach = false) => {
        if (!string) throw new Error('{toCapitalize}: Can not invoke with null paramter')

        if (applyToEach) {
            // Capitalize each word
            const rawWords = string.split(" ")
            const capitalizedWords = Array()
            rawWords.forEach(element => {
                element = element.charAt(0).toUpperCase() + element.slice(1,element.length)
                capitalizedWords.push(element)
            })
            
            return capitalizedWords.join(" ")
        }else {
            // Capitalize only the first word
            return string.charAt(0).toUpperCase() + string.slice(1, string.length)
        }
    },

}