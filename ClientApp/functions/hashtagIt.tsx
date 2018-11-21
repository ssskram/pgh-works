
// this takes a string, and turns it into a hashtag
// for the millenials

export default function hashtagIt(string) {
    // hashtag it!
    const uppercase = string.replace(/\b[a-z](?=[a-z]{1})/g, letter => letter.toUpperCase())
    return uppercase.replace(/\s/g, '')
}