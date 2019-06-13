// removes duplicate items from array

export default function removeDuplicates(originalArray, prop) {
  let newArray = [] as any;
  let lookupObject = {};
  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }
  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}
