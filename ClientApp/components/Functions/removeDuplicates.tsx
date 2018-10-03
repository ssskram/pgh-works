
export default function removeDuplicates(originalArray, prop) {
    var newArray = [] as any
    var lookupObject = {}
    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i]
    }
    for (i in lookupObject) {
        newArray.push(lookupObject[i])
    }
    return newArray;
}
